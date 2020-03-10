const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongooose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('../models/user');


/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Online Tracker',
        user: req.user
    });

});


// GET /about
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About us',
        user: req.user
    });
});

// GET /register
router.get('/register', ((req, res, next) => {
    res.render('register', {
        user: req.user
    });
}));


// GET /login
router.get('/login', ((req, res, next) => {
    // check the session for error messages to display
    let messages = req.session.messages || [];
    // empty the session message
    req.session.messages = [];

    res.render('login', {
        title: "Please Login",
        messages: messages,
        user: req.user
    });
}));


/**
 * POST /login
 */

// authenticate('what db are we using')
router.post('/login', passport.authenticate('local', {
    successRedirect: '/projects',
    failureRedirect: '/login'
}));


// POST : /register , use passport to create a new user
router.post('/register', (req, res) => {
    // use the User model & passport to register.
    // send password separately so password can hash it
    User.register(new User({
        username: req.body.username
    }), req.body.password, (err, user) => {
        if (err) {
            res.render('register', {
                message: err,
                user: req.user
            });
        } else {
            // password has a method to automatically log the user in
            // redirect to the main page
            passport.authenticate('local', (req, res) => {
                res.redirect('/login');
            });
        }
    });
});

// GET /logout
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});


// GET :/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET: /google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    failureMessage: 'Invalid login',
    scope: 'email'
}),
    (req, res, next) => {
        res.redirect('/projects');
    }
);

module.exports = router;
