// include mongoose
const mongoose = require('mongoose');

// create a schema for projects
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'username is required.'
    },
    description: {
        type: String,
        required: 'Project description is required.'
    }
});

// make this model public with the name 'Project'
// export it as a new model and the controller can access it
module.exports = mongoose.model('Project', projectSchema);