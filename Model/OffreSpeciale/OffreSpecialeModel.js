const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var offreSpecialeFields = new Schema({
    _idOffreSpeciale: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateDebut: {
        type: Date,
        required: true
    },
    dateFin: {
        type: Date,
        required: true
    },
    idService: {
        type: Number,
        required: true
    },
    pourcentageRemise: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('offrespeciales', offreSpecialeFields);