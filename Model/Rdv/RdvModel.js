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
rdvFields.statics.getRdvsByIdEmploye = async function (idEmploye) {
    try {
        const response = await this.find({
            idEmploye: idEmploye,
            etatFini: false
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
        throw error;
    }
};

rdvFields.statics.getRdvsByIdEmploye_groupByDAY = async function (idEmploye) {
    try {

        const today = new Date();

        // Créer une date avec le début du jour courant (00:00:00)
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // Créer une date avec la fin du jour courant (23:59:59)
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
        console.log('tonga ehh');

        const response = await this.find({
            idEmploye: idEmploye,
            etatFini: false,
            dateHeureFin: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
        throw error;
    }
};




const Rdv = mongoose.model('rdvs', rdvFields);
module.exports = Rdv;