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
    },
    datePayement: {
        type: Date,
        required: false
    },
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




rdvFields.statics.getRdvsDONEByIdEmploye_groupByDAY = async function (idEmploye, startOfDay, endOfDay) {
    try {

        const _startOfDay = new Date(startOfDay);

        const _startOfDay23H = new Date(_startOfDay);
        _startOfDay23H.setDate(_startOfDay23H.getDate() + 1);
        _startOfDay23H.setMilliseconds(_startOfDay23H.getMilliseconds() - 1);

        const response = await this.find({
            idEmploye: idEmploye,
            etatFini: true,
            dateHeureFin: {
                $gte: _startOfDay,
                $lt: _startOfDay23H
            }
        });
        return response;
    } catch (error) {
        console.error('Erreur lors de la récupération des rendez-vous :', error);
        throw error;
    }
};

rdvFields.statics.getCommissionByidEmployeeDaily = async function (idEmploye, startOfDay, endOfDay) {
    // const all_tache_daily = await mongoose.model('v_suivitachesjournalieres').aggregate([
    //     {
    //         $match: {
    //             idEmploye: parseInt(idEmploye)
    //         }
    //     }
    // ]);

    const _startOfDay = new Date(startOfDay);

    const _startOfDay23H = new Date(_startOfDay);
    _startOfDay23H.setDate(_startOfDay23H.getDate() + 1);
    _startOfDay23H.setMilliseconds(_startOfDay23H.getMilliseconds() - 1);
    
    const all_tache_daily = await this.find({
        idEmploye: idEmploye,
        etatFini: true,
        dateHeureFin: {
            $gte: _startOfDay,
            $lt: _startOfDay23H
        }
    });
    
    let all_tache_daily_obj = all_tache_daily.map(tache => tache.toObject());
    
    for (let tache of all_tache_daily_obj) {
        let totalMontantCommission = 0;
        console.log(" irdv " + tache._idRdv);
        const rdvServices = await mongoose.model('rdvservices_all_sum').aggregate([
            {
                $match: {
                    idRdv: parseInt(tache._idRdv)
                }
            }
        ]);
    
        for (let rdvService of rdvServices) {
            totalMontantCommission += parseInt(rdvService.totalMontantCommission);
            console.log("ttt " + rdvService.totalMontantCommission + " tena sum " + parseInt(totalMontantCommission));
        }
        // Ajouter totalMontantCommission à tache
        tache.totalMontantCommission = totalMontantCommission;
    }
    
    return all_tache_daily_obj;
    
}


// Créer un schéma avec une structure vide, car nous n'avons pas besoin de valider les champs pour une vue
var EmptySchema = new Schema({}, {
    strict: false
});

// Enregistrer le modèle pour la vue
mongoose.model('v_suivitachesjournalieres', EmptySchema, 'v_suivitachesjournalieres');
mongoose.model('rdvservices_all_sum', EmptySchema, 'rdvservices_all_sum');


const Rdv = mongoose.model('rdvs', rdvFields);
module.exports = Rdv;