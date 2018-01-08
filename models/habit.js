var mongoose = require('mongoose');

// define the schema for our habit model
var habitSchema = mongoose.Schema({

        text        : {type: String, required: true},
        owner       : {type: mongoose.Schema.ObjectId, ref: 'User', required: true}, 
        createdOn   : {type: Date, default: Date.now},
});


module.exports = mongoose.model('Habit', habitSchema);