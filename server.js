var express = require("express");
var app  = express();
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
var passport = require('passport');
var configDB = require('./config/database.js');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var flash        = require('connect-flash');


// connect to database 
mongoose.connect(configDB.url, {
  useMongoClient: true
}); 


// pass to passport for configuration
require('./config/passport')(passport); 


// set up our express application
app.use(express.static('client/css'));
app.use(morgan('dev'));             // log every request to the console
app.use(cookieParser());            // read cookies (needed for auth)
app.use(bodyParser.urlencoded({     // get information from html forms
  extended: true
})); 


// set up ejs for templating
app.set('view engine', 'ejs'); 


// set up session parameters
app.use(require('express-session')({
    secret: 'hackathon hackathon',
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 60000 }
}));


// required for passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// load our routes and pass in our app and fully configured passport
require('./routes.js')(app, passport); 


app.listen(port,function(){
  console.log('Live at Port ' + port);
});