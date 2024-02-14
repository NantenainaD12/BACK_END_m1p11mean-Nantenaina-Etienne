const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rdvServiceFields = new Schema({
    idRdv: {
        type: Number,
        required: true
    },
    idService: {
        type: Number,
        required: true
    },
    prixNormal: {
        type: Number,
        required: true
    },
    prixApresRemise: {
        type: Number,
        required: true
    },
    idOffreSpeciale: {
        type: Number,
        required: false
    },
    montantCommission: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('rdvservices', rdvServiceFields);