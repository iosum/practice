const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    projectPhase : {
        type: String,
        enum: ['Initiation','Planning','Implementation','Monitoring and Control','Closing']
    },
    hours: {
        type: Number,
        min: 0
    },
    date: {
        type: Date
    },
    description:{
        type: String
    },
    invoice : {
      type: Boolean
    }
});

module.exports = mongoose.model('Timesheet',timesheetSchema);