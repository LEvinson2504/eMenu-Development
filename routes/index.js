const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require('../models/User');

//welcome page
router.get('/', (req, res) => res.render('welcome'));

//dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => { 
    res.render('dashboard', {
        name: req.user.name,
        menu: req.user.menu,
        deleteItem: "deleteItem(index)"
    });

})

router.get('/menu/:id', (req, res) => {
    let id = req.params.id;
    // res.json(menuId);
    console.log(req.params);
    User.findOne({_id: id}, function(err, user){
        if(err) {
            res.status(500).send();
        } else {
            console.log(user);
            res.render('publicMenu', {
                name: user.name,
                menu: user.menu,
                barcode: "https://pacific-savannah-86216.herokuapp.com/menu/" + id,
                // itemName: req.user.menu,
                // itemPrice: req.user.menu,
            });
        }
    });
});


module.exports = router;