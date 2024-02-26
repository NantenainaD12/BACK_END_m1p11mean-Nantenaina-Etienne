require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel')
var ServiceModel = require('../Model/Service/ServiceModel')
const mongoose = require('mongoose');
const DepenseModel = require('../Model/Depenses/DepenseModel');


var StatistiqueFields = {
    CoutReservation_Day_month: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const jour = parseInt(req.body.jour);
            const ReservationParJour = mongoose.model('v_ReservationParJour');
            console.log("mois " + mois + " jour= " + jour);
            const result = await ReservationParJour.findOne({
                mois: mois,
                jour: jour
            });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'Aucune réservation trouvée pour ce jour et ce mois.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Une erreur est survenue lors de la recherche des réservations.'
            });
        }
    },
    CoutReservation_By_month: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ReservationParMois = mongoose.model('v_ReservationParMois');
            const result = await ReservationParMois.findOne({
                mois: mois
            });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'Aucune réservation trouvée pour ce mois.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Une erreur est survenue lors de la recherche des réservations.'
            });
        }
    },
    ChiffreAffaireParJour: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const jour = parseInt(req.body.jour);
            const ChiffreAffaireParJour = mongoose.model('v_ChiffreAffaireParJour');
            const result = await ChiffreAffaireParJour.findOne({
                mois: mois,
                jour: jour
            });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'Aucun chiffre d\'affaires trouvé pour ce jour et ce mois.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires.'
            });
        }
    },

    ChiffreAffaireParMois: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ChiffreAffaireParMois = mongoose.model('v_ChiffreAffaireParMois');
            const result = await ChiffreAffaireParMois.findOne({
                mois: mois
            });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({
                    message: 'Aucun chiffre d\'affaires trouvé pour ce mois.'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires.'
            });
        }
    },
    Get_benfice_monthly: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ChiffreAffaireParMois = mongoose.model('v_ChiffreAffaireParMois');
            const DepenseParMois = mongoose.model('v_DepenseParMois');

            const chiffreAffaire = await ChiffreAffaireParMois.findOne({
                mois: mois
            });
            const depense = await DepenseParMois.findOne({
                mois: mois
            });

            // Utilisez '?? 0' pour définir une valeur par défaut de 0 si total est null
            const totalChiffreAffaire = chiffreAffaire?.total ?? 0;
            const totalDepense = depense?.total ?? 0;

            // Calculez le bénéfice en utilisant les totaux avec des valeurs par défaut
            const benefice = totalChiffreAffaire - totalDepense;

            res.json({
                mois: mois,
                chiffreAffaire: totalChiffreAffaire,
                depense: totalDepense,
                benefice: benefice
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires et des dépenses.'
            });
        }
    },
    CreateDepense: async (req, res) => {
        try {
            const description = req.body.description;
            const montant = req.body.montant;
            const datedepense = req.body.dateDepense;
            console.log(datedepense);

            const depense = new DepenseModel();
            depense._id = description+montant;
            depense.description = description;
            depense.montant = montant;
            depense.dateDepense = new Date(datedepense);

            const savedOffreSpecial =   await depense.save();

            res.status(201).send(savedOffreSpecial);
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    GetDepensemonthly: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const annee = new Date().getFullYear(); // Obtenez l'année en cours
    
            // Créez les dates de début et de fin du mois
            const dateDebut = new Date(annee, mois - 1, 1);
            const dateFin = new Date(annee, mois, 0, 23, 59, 59);
    
            const result = await DepenseModel.find({
                dateDepense: { $gte: dateDebut, $lte: dateFin }
            });
    
            if (result) {
                res.json(result);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erreur du serveur');
        }
    }
    

}


module.exports = StatistiqueFields;