module.exports = function(app, passport) {
    var path    = __dirname + '/views/';
    var session = require('express-session');
    var Habit = require('./models/habit.js');


    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
    });
    
    
    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/mainPage', // redirect to the secure section
        failureRedirect : '/signup', // redirect back if there is an error
    }));
    
    
    // login page
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('loginMessage') });
    });
    
    
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/mainPage', 
        failureRedirect : '/', 
        failureFlash : true
    }));
    
    
    // add new habit 
    app.post('/addHabit', isLoggedIn, function(req, res) {
        
        // connect to database
        var mongoose = require('./config/connection.js');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection Error : '));
        db.once('open', function(){
          console.log('Connection ok');
        });

        // current user
        var user = req.user;

        // save user
        user.save(function (err) {
            if (err) return console.log(err);
            
            var newHabit = new Habit({ text: req.body.habit, owner: user._id });

            // save habit
            newHabit.save(function (err) {
                if (err) return console.log(err)
            });
        
            // this might be unnecessary -- other functions find by user id search
            // add new habit to user's habit array
            // user.habits.push(newHabit);

            // reload page with changes
            res.redirect('mainPage');
        });
     });
     
     
      app.post('/deleteHabit', isLoggedIn, function(req, res) {
          
        // connect to database
        var mongoose = require('./config/connection.js');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'Connection Error : '));
        db.once('open', function(){
          console.log('Connection ok');
        });
        
        // habit to delete
        var habitText = req.body.habit;
    
        // find and delete all habits posted by user that match the text entered
        Habit.
            find({ owner: req.user._id, text: habitText }).
            remove(function (err, habits) {
            if (err) return console.log(err);
        });
        
        // reload with changes
        res.redirect('mainPage');
     });
     
     
    // main page with tracker
    app.get('/mainPage', isLoggedIn, function(req, res) {
        
        // finds all habits associated with user's id
        Habit.
          find({ owner: req.user._id }).
          select('text -_id').
          exec(function (err, habits) {
            if (err) return console.log(err);
            //console.log('The habits are an array: ', habits);
            res.render('mainPage', {habits: habits});        
        });
    });


    // logout
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
    
    // suggestions page
    app.get('/suggestions', function(req, res) {
        res.render('suggestions.ejs');
    });
    

    // middleware to make sure a user is logged in when accessing mainPage
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }

}
    
