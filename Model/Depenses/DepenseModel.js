const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepenseFields = new Schema({
    _id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    montant: {
        type: Number,
        required: true
    },
    dateDepense: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('depenses', DepenseFields);