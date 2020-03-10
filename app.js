const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// import mongoose for db connection
const mongoose = require('mongoose');

// passport references for auth
const passport = require('passport');
const session = require('express-session');

// import the body parser
const bodyParser = require('body-parser');

// import the google auth package
const google = require('passport-google-oauth');


/**
 * controllers
 * @type {Router}
 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
// add reference to the project controller
const projectsRouter = require('./routes/projects');
// add reference to the client controller
const clientsRouter = require('./routes/clients');
const timesheetsRouter = require('./routes/timesheets');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));


/**
 * db connection
 * @type {{db: string}}
 */
const globals = require('./config/globals');

// set up a few options as json object
mongoose.connect(globals.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    (res) => {
        console.log('connect to db');
    }
).catch(() => {
    console.log('404');
});


/**
 * passport configuration
 */

// passport auth config
// 1. set up a session management
app.use(session({
    secret: '12222rrrrrr',
    resave: true,
    saveUninitialized: false
}));

// 2. initialize passport
app.use(passport.initialize());
app.use(passport.session());

// 3. link passport to the User model
const User = require('./models/user');
passport.use(User.createStrategy());

// 4. set up password to read/write user data to/from the session object
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

let googleStrategy = require('passport-google-oauth').OAuth2Strategy;

// google auth strategy
passport.use(new googleStrategy({
        clientID: globals.google.googleClientId,
        clientSecret: globals.google.googleClientSecret,
        callbackURL: globals.google.googleCallbackUrl,
        profileFields: ['id', 'emails']
    },
    (accessToken, refreshToken, profile, callback) => {
        User.findOrCreate({
            googleId: profile.id,
            username: profile.emails[0].value
        }, (err, user) => {
            return callback(err, user);
        });
    }
));


app.use('/users', usersRouter);
// map any urls starting with /projects to be handled by the projects controller
app.use('/projects', projectsRouter);
// map any urls starting with /clients to be handled by the clients controller
app.use('/clients', clientsRouter);
app.use('/timesheets',timesheetsRouter);
app.use('/', indexRouter);


/**
 * express generator default error handler
 */


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
