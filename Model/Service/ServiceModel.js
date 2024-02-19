const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    },
    pdp: {
        type: String, // Utilisation d'un lien vers l'image du profil (String)
        required: true
    },
    horaireDebut: {
        type: String,
        required: true
    },
    horaireFin: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('services', serviceFields);