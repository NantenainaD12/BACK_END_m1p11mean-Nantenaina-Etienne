const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var serviceFields = new Schema({
    _idService: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Photo: {
        type: String,
        required: true
    },
    dureeMinute: {
        type: Number,
        required: true
    },
    prix: {
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('services', serviceFields);