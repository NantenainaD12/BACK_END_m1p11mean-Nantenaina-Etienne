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
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

        // Créer une date avec la fin du jour courant (23:59:59)
        const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));

        const response = await this.find({
            idEmploye: idEmploye,
            etatFini: true,
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

// rdvFields.statics.getCommissionByidEmployeeDaily = async function (idEmploye) {
//     // Récupérer les documents de la vue "v_suivitachesjournalieres" pour l'idEmploye donné
//     console.log('aona ahh'+idEmploye);
//     const rdvs = await mongoose.model('v_suivitachesjournalieres').aggregate([
//         {
//             $match: { idEmploye: parseInt(idEmploye) }
//         },
//         {
//             $lookup: {
//                 from: 'rdvservices_all_sum',
//                 let: { idRdv: '$idRdv' },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ['$idRdv', '$$idRdv']
//                             }
//                         }
//                     },
//                     {
//                         $group: {
//                             _id: null,
//                             totalMontantCommission: { $sum: "$totalMontantCommission" }
//                         }
//                     }
//                 ],
//                 as: 'totalMontantCommission'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$totalMontantCommission',
//                 preserveNullAndEmptyArrays: true
//             }
//         },
//         {
//             $addFields: {
//                 totalMontantCommission: '$totalMontantCommission.totalMontantCommission'
//             }
//         }
//     ]);

//     return rdvs;
// };

rdvFields.statics.getCommissionByidEmployeeDaily = async function (idEmploye) {
    const all_tache_daily = await mongoose.model('v_suivitachesjournalieres').aggregate([
        {
            $match: {
                idEmploye: parseInt(idEmploye)
            }
        }
    ]);

    for (let tache of all_tache_daily) {
        let totalMontantCommission = 0;
        console.log(" irdv "+ tache._idRdv);
        const rdvServices = await mongoose.model('rdvservices_all_sum').aggregate([
            {
                $match: {
                    idRdv: parseInt(tache._idRdv)
                }
            }
        ]);
        
        for (let rdvService of rdvServices) {
            console.log("ttt "+rdvService.totalMontantCommission+" irdv "+ parseInt(tache._idRdv));
            totalMontantCommission += parseInt(rdvService.totalMontantCommission);
        }
        // Ajouter totalMontantCommission à tache
        tache.totalMontantCommission = totalMontantCommission;
    }

    // Retourner all_tache_daily avec totalMontantCommission pour chaque tache
    return all_tache_daily;
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