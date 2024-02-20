require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel')
var ServiceModel = require('../Model/Service/ServiceModel')
const mongoose = require('mongoose');


var StatistiqueFields = {
    CoutReservation_Day_month: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const jour = parseInt(req.body.jour);
            const ReservationParJour = mongoose.model('v_ReservationParJour');
            console.log("mois "+mois+" jour= "+jour);
            const result = await ReservationParJour.findOne({ mois: mois, jour: jour });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Aucune réservation trouvée pour ce jour et ce mois.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la recherche des réservations.' });
        }
    }
    ,
    CoutReservation_By_month: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ReservationParMois = mongoose.model('v_ReservationParMois');
            const result = await ReservationParMois.findOne({ mois: mois });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Aucune réservation trouvée pour ce mois.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la recherche des réservations.' });
        }
    },
    ChiffreAffaireParJour: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const jour = parseInt(req.body.jour);
            const ChiffreAffaireParJour = mongoose.model('v_ChiffreAffaireParJour');
            const result = await ChiffreAffaireParJour.findOne({ mois: mois, jour: jour });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Aucun chiffre d\'affaires trouvé pour ce jour et ce mois.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires.' });
        }
    },
    
    ChiffreAffaireParMois: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ChiffreAffaireParMois = mongoose.model('v_ChiffreAffaireParMois');
            const result = await ChiffreAffaireParMois.findOne({ mois: mois });
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Aucun chiffre d\'affaires trouvé pour ce mois.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires.' });
        }
    },
    Get_benfice_monthly: async (req, res) => {
    },
    Get_benfice_monthly: async (req, res) => {
        try {
            const mois = parseInt(req.body.mois);
            const ChiffreAffaireParMois = mongoose.model('v_ChiffreAffaireParMois');
            const DepenseParMois = mongoose.model('v_DepenseParMois');
    
            const chiffreAffaire = await ChiffreAffaireParMois.findOne({ mois: mois });
            const depense = await DepenseParMois.findOne({ mois: mois });
    
            if (chiffreAffaire && depense) {
                const benefice = chiffreAffaire.total - depense.total;
                res.json({
                    mois: mois,
                    chiffreAffaire: chiffreAffaire.total,
                    depense: depense.total,
                    benefice: benefice
                });
            } else {
                res.status(404).json({ message: 'Aucun chiffre d\'affaires ou dépense trouvée pour ce mois.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Une erreur est survenue lors de la recherche du chiffre d\'affaires et des dépenses.' });
        }
    }
    
    
}


module.exports = StatistiqueFields;