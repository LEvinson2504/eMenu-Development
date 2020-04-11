const mongoose = require("mongoose");

// const MenuSchema = new mongoose.Schema({

// });

const OrderSchema = new mongoose.Schema({ 
    table: {
        type: String,
        // required: true
    },
    items: {
        type: [String],
    },
    totalPrice: {
        type: Number,
    },
    payment: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const MenuSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        default: "ItemName",
    },
    itemPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    itemImage: {
        type: String,
        required: false, //can add a default image here 
    },
    itemDescription: {
        type: String,
        // required: true,
    },
    itemType: {
        type: String,
        // required: true,
    },
    
});



const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    menu: {
        type: [MenuSchema],
        default: [{ itemName: "nothing here",
                    itemPrice: 0, 
                    itemDescription: "add description here"
                    , itemType: "not selected" 
                }]
    },
    orders: [OrderSchema]
});

const User = mongoose.model("User", UserSchema);
module.exports = User; //alternate method

const Menu = mongoose.model("Menu", MenuSchema);
module.exports.Menu = Menu;