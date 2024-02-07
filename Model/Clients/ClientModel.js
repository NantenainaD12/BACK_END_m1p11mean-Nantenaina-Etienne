const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientFields = new Schema({
    _idClient:{
        type: Number,
        required: true
    },
    nom:{
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('clients',clientFields);
