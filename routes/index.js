const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require('../models/User');
const {Menu} = require('../models/User')

//make styles public
router.use( express.static( "public/" ) )
//body parser
router.use(express.json());
//welcome page
router.get('/', (req, res) => res.render('welcome'));

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => { 
    res.render('dashboard', {
        name: req.user.name,
        menu: req.user.menu,
        barcode: "https://pacific-savannah-86216.herokuapp.com/menu/" + req.user._id,
    });

})

router.post('/dashboard', ensureAuthenticated, (req, res) => { 
    console.log(req.body.tablenumber);
    res.render('dashboard', {
        name: req.user.name,
        menu: req.user.menu,
        barcode: "https://pacific-savannah-86216.herokuapp.com/menu/" + req.user._id + "/" + req.body.tablenumber,
    });

})

router.get('/menu/:id/:table?', (req, res) => {

    //shorthand for let id = req.params.id
    const {id, table} = req.params;
    // res.json(menuId);
    // console.log(req.params);
    User.findOne({_id: id}, function(err, user){
        if(err) {
            res.status(500).send();
        } else {
            // console.log(user);
            res.render('publicMenu', {
                name: user.name,
                menu: user.menu,
                barcode: "https://pacific-savannah-86216.herokuapp.com/menu/" + id,
                table: table || 0,
                // itemName: req.user.menu,
                // itemPrice: req.user.menu,
            });
        }
    });
});

//Place order 
router.post("/menu/order", express.json(), (req, res) => {
    console.log(req.body);
    const {items, table, totalPrice} = req.body;
    console.log( items + " was ordered on table " + table);
    User.findOne({name: "test"}, function(err, user){
        // console.log(user.orders);
        if (err) {
            res.status(500).send();
        } else {
            user.orders.push({
                table: table,
                items: items,
                totalPrice: totalPrice
            })
        }
        user.save(function(err, savedUser){
            if(err){
                res.status(500).send();
            } else {
                res.render('pendingOrders', {
                    name: savedUser.name,
                    menu: savedUser.orders
                })
            }
        })
    });
    
});

module.exports = router;
