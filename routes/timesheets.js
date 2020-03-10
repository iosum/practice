const express = require('express');
const router = express.Router();

// add mongoose and projects model references for CRUD
const mongoose = require('mongoose');

const Project = require('../models/project');
// add the clients model to get the client collections
const Client = require('../models/client');
const Timesheet = require('../models/timesheet');


// add body-parser to parse the response of the body
const bodyParser = require('body-parser');
// add functions to global
const functions = require('../config/functions');

const findClients = (req, res, next) => {
    // get the clients dropdown
    Client.find((err, clients) => {
        if (err) {
            console.log(err);
        } else {
            res.render('timesheets/add', {
                clients: clients,
                user: req.user
            });
        }
    });
};

const findProjects = (req, res, next) => {
    // get the project dropdown
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
        } else {
            // load the main timesheets page
            res.render('timesheets/add', {
                projects: projects,
                user: req.user
            });
        }
    });
};


// GET /timesheets
router.get('/', functions.isLoggedIn, (req, res, next) => {
    // use the Project model & mongoose to select(read) all the projects from MongoDB
    Timesheet.find((err, timesheets) => {
        if (err) {
            console.log(err);
        } else {
            res.render('timesheets/index', {
                timesheets: timesheets,
                user: req.user
            });
        }
    });
});

router.get('/add',findClients,findProjects);

// POST /timesheets/add
router.post('/add',functions.isLoggedIn, (req, res, next) => {
    // create a new document in the projects collection using the project model
    Timesheet.create({
        // get the data from the form and store it in the mongodb
        client: req.body.client,
        project: req.body.project,
        hours: req.body.hours,
        date: req.body.date,
        description: req.body.description,
    }, (err, newTimeSheet) => {
        // if we get an error while storing the data
        if (err) {
            // log the error to the console
            console.log(err);
        }
        // otherwise, the data is stored successfully and we can redirect to the main page
        else {
            // load the updated project index
            res.redirect('/timesheets');
        }
    })
});



// GET /projects/delete/foo
// :_id means this method expects a parameter called "_id"
router.get('/delete/:_id',functions.isLoggedIn, (req, res, next) => {
    // use the mongoose model to delete the selected document
    // http requests has a parameter called _id, and we can access it through it's attribute which is params
    Timesheet.remove({_id: req.params._id}, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/timesheets');
        }
    });
});

// GET /projects/edit/:_id : display the populated edit form
router.get('/edit/:_id',functions.isLoggedIn, (req, res, next) => {
    Timesheet.findById(req.params._id, (err, timesheet) => {
        if (err) {
            console.log(err);
        } else {
            res.render('timesheets/edit', {
                timesheet: timesheet,
                user: req.user
            });
        }
    });
});

// POST /projects/edit/:_id
router.post('/edit/:_id',functions.isLoggedIn, (req, res, next) => {
    Timesheet.findOneAndUpdate({
            _id: req.params._id
        },
        {
            name: req.body.client,
            project: req.body.project,
            projectphase: req.body.projectphase,
            hours: req.body.hours,
            date: req.body.date,
            description: req.body.description,
            invoice: req.body.invoice
        }, (err, project) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/timesheets');
            }
        });
});




module.exports = router;