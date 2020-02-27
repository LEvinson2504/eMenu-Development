const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
//Login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

//register handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body; //destructuring
    let errors = [];

    //check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please enter all fields"});
    }

    //check passwords match
    if (password !== password2) {
        errors.push({ msg: "Passwords do not match"});
    }

    //check pass length
    if (password.length < 6) {
        errors.push({ msg: "Password should be atleast 6 characters"});
    }

    if (errors.length > 0) {
        res.render("register", {
            errors,
            name, 
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ email: email }).
        then(user => {
            if(user) {
                //user exists
                errors.push({msg: "Email is already in use"});
                res.render("register", {
                    errors,
                    name, 
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email, 
                    password,
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hashedpass) => {
                        if(err) throw err;
                        //set pass to hashed
                        newUser.password = hashedpass;
                        //save user
                        newUser.save()
                        .then( user => {
                            req.flash("success_msg", "You are now registered and can login");
                            res.redirect("/users/login");
                        })
                        .catch(err => console.log(err));
                    })}
                )}
        })
    }
});

//login handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

//Menu display
router.get('/menu', ensureAuthenticated, (req, res) => { 
    console.log(req.user.name);
    User.findOne({name: req.user.name}, function(err, user){
        if(err) {
            res.status(500).send();
        } else {
            console.log(user);
            res.render('menu', {
                name: user.name,
                menu: user.menu,
                // itemName: req.user.menu,
                // itemPrice: req.user.menu,
            });
        }
    });
   

})

//Menu add items
router.post('/menu', ensureAuthenticated, (req, res) => { 
    // console.log(req.body.itemName);
    const {name, email, menu} = req.user;
    let errors = []

    User.findOne({email: email}, function(err, foundUser){
        if(err) {
            console.log(error);
            res.status(500).send();
        } else{
            if(!foundUser){
                res.status(404).send();
            } else if(req.body.itemName == "" || req.body.itemPrice == "" || req.body.itemPrice.isNaN()){
                errors.push({msg: "Fields cannot be blank"});
            }
            else {
                foundUser.menu.push({itemName: req.body.itemName, itemPrice: req.body.itemPrice});
            }
            foundUser.save(function(err, savedUser) {
                if(err){
                    console.log(err);
                }
                if (errors.length > 0) {
                    res.render("menu", {
                        errors,
                        name, 
                        menu,
                    });
                } else{
                res.render('menu', {
                    name: savedUser.name,
                    menu: savedUser.menu,
                });
            }
            })
        }
    })
    // console.log(menu);
   

})

//delete menu item
router.post("/menu/del", (req, res) => {
    // console.log("i got a request!");
    console.log(req.body);
    const {name, email, menu} = req.user;
    const item = req.body;

    // User.findOne({email: email}, function(err, foundUser){
    //     if(err) {
    //         console.log(error);
    //         res.status(500).send();
    //     }
});

//Logout handle
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "you are logged out!");
    res.redirect("/users/login");
});


module.exports = router;