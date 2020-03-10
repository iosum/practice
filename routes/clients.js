const express = require('express');
const router = express.Router();

// add mongoose & Client model for CRUD
const mongoose = require('mongoose');
const Client = require('../models/client');
const passport = require('passport');
// add body-parser to parse the response of the body
const bodyParser = require('body-parser');
// require functions config
const functions = require('../config/functions');


const getClient = (req, res) => {
    Client.findOne({name: req.params.name})
        .populate('projects');
};

const createClient = (req, res) => {
    const client = new Client();
    client.name = req.body.name;
}


// GET /clients
router.get('/',functions.isLoggedIn, (req, res) => {
    Client.find((err, clients) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('clients/index',{
                clients: clients,
                user: req.user
            });
        }
    });
});


// GET /clients/add
router.get('/add',functions.isLoggedIn, (req, res) => {
    res.render('clients/add');
});

// store the client from the add new client form
router.post('/add', functions.isLoggedIn, (req, res) => {
    Client.create({
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
        postalCode: req.body.postalCode,
        email: req.body.email,
        rate: req.body.rate
    },(err, newClient) => {
        if(err) {
            console.log(err);
        }
        else {
            res.redirect('/clients');
        }
    });
});

// GET /clients/delete/foo
// :_id means this method expects a parameter called "_id"
router.get('/delete/:_id', functions.isLoggedIn,(req, res, next) => {
    // use the mongoose model to delete the selected document
    // http requests has a parameter called _id, and we can access it through it's attribute which is params
    Client.remove({_id: req.params._id}, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/clients');
        }
    });
});

// GET /clients/edit/:_id : display the populated edit form
router.get('/edit/:_id',functions.isLoggedIn, (req, res, next) => {
    Client.findById(req.params._id, (err, client) => {
        if (err) {
            console.log(err);
        } else {
            res.render('clients/edit', {
                client: client,
                user: req.user
            });
        }
    });
});

router.post('/edit/:_id',functions.isLoggedIn, (req, res, next) => {
    Client.findOneAndUpdate({
            _id: req.params._id
        },
        {
            name: req.body.name,
            contact: req.body.contact,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country,
            postalCode: req.body.postalCode,
            email: req.body.email,
            rate: req.body.rate
        }, (err, client) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/clients');
            }
        });
});

module.exports = router;