const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rdvFields = new Schema({
    _idRdv: {
        type: Number,
        required: true
    },
    idClient: {
        type: Number,
        required: true
    },
    dateHeureDebut: {
        type: Date,
        required: true
    },
    dateHeureFin: {
        type: Date,
        required: true
    },
    idEmploye: {
        type: Number,
        required: true
    },
    montantTotalPaye: {
        type: Number,
        required: false
    },
    etatFini: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('rdvs', rdvFields);