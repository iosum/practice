const mongoose = require('mongoose');


const clientSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    contact: {
        type: String,
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String
    },
    postalCode: {
        type: String
    },
    email: {
        type: String,
    },
    rate: {
        type: Number
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

module.exports = mongoose.model('Client', clientSchema);