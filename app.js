const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
// const ejsLint = require('ejs-lint');

const app = express();

//make uploads public
app.use(express.static("uploads"));

//make styles public
app.use(express.static("public"));
//passport config 
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").MongoURI;

//connect to mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then(console.log("mongodb connected"))
  .catch(err => console.log(err));

//use EJS client side
app.use(expressLayouts);
app.set("view engine", "ejs");

//Body parser
app.use(express.urlencoded({ extended: false }));

//express sessiion middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
