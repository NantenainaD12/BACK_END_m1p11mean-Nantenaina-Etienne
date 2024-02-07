const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeFields = new Schema({
    _idEmployee:{
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
    },
    salaire: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('employee',employeeFields);
