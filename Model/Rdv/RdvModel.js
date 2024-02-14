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

rdvFields.statics.getRdvsByIdEmploye = async function(idEmploye) {
    try {
        const response = await this.find({ salaire : 12.5 });
        console.log(" id_employe " +idEmploye+ "response = "+ response);
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
        throw error;
    }
};

const Rdv = mongoose.model('rdvs', rdvFields);
module.exports = Rdv;
