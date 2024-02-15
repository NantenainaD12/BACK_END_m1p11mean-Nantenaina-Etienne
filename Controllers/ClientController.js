var ClientModel = require('../Model/Client/ClientModel');
var ServiceModel = require('../Model/Service/ServiceModel');
var RdvModel = require('../Model/Rdv/RdvModel');
var RdvServiceModel = require("../Model/RdvService/RdvServiceModel");
var OffreSpecialeModel = require("../Model/OffreSpeciale/OffreSpecialeModel");
var EmployeModel = require("../Model/Employee/EmployeeModel");
const getNextSequence = require('../Model/Tools/Counter');

var clientMethods = {
    signInClient: async(req, res) => {
        try {
            var email = req.body.email;
            var mdp = req.body.mdp;
            const client = await ClientModel.findOne({ email: email, mdp: mdp });
            if (client) {
                req.session.client = client;
                res.status(200).send(client);
            } else {
                res.status(400).send("Client non authentifié");
            }
        } catch (error) {
            console.log("Erreur lors de l'authentification du client ", error.message);
            res.status(400).send(error);
        }
    },
    homepageClient: async(req, res) => {
        try {
            if (req.session && req.session.client) {
                const client = req.session.client;
                res.send(client);
            } else {
                res.send('Connectez-vous d\'abord');
            }
        } catch (error) {
            console.log("Erreur dans la page d'accueil du client ", error.message);
            res.status(400).send(error);
        }
    },
    logoutClient: async(req, res) => {
        if (req.session.client) {
            delete req.session.client;
            res.status(200).send("Compte client deconnecté");
        } else {
            res.status(400).send("Erreur lors de la déconnexion");
        }
    },
    loginClient: async(req, res) => {
        res.status(200).send("Login");
    },
    createAccountClient: async(req, res) => {
        try {
            var client = new ClientModel({
                _idClient: await getNextSequence('clients'),
                nom: req.body.nom,
                email: req.body.email,
                mdp: req.body.mdp,
                pdp: req.body.pdp,
                telephone: req.body.telephone
            });

            const newClient = await client.save();
            console.log("Compte client créé avec succès :", newClient);
            res.status(200).send(newClient);
        } catch (error) {
            console.error("Erreur lors de la création du compte client ", error.message);
            res.status(400).send(error);
        }
    },
    onlineAppointmentBooking: async(req, res) => {
        try {
            var _idRdv = 0;
            var idClient = req.session.client._idClient;
            var dateHeureDebut = new Date(req.body.dateHeureDebut);
            if (dateHeureDebut.getTime() < new Date().getTime()) {
                res.status(400).send("Date de début invalide");
                return;
            }
            _idRdv = await getNextSequence('rdvs');
            var idEmploye = req.body.idEmploye;
            var idServices = req.body.idServices;
            const services = await ServiceModel.find({ _idService: { $in: idServices } }).exec();
            var minutes = 0;
            var montantTotal = 0;
            for (const service of services) {
                var rdvService = new RdvServiceModel({
                    idRdv: _idRdv,
                    idService: service._idService,
                    prixNormal: service.prix,
                    prixApresRemise: service.prix,
                    montantCommission: service.prix * service.commission
                });
                const offreSpeciales = await OffreSpecialeModel.find({ idService: service._idService }).exec();
                for (const offreSpeciale of offreSpeciales) {
                    if (offreSpeciale && offreSpeciale.dateDebut <= dateHeureDebut && dateHeureDebut <= offreSpeciale.dateFin) {
                        rdvService.idOffreSpeciale = offreSpeciale._idOffreSpeciale;
                        rdvService.prixApresRemise =  service.prix * (1 - offreSpeciale.pourcentageRemise);
                        rdvService.montantCommission = rdvService.prixApresRemise * service.commission;
                        break;
                    }
                }
                minutes += service.dureeMinute;
                montantTotal += rdvService.prixApresRemise;
                await rdvService.save();
            }
            const dateHeureFin = new Date(dateHeureDebut.getTime() + (minutes * 60000));
            var rdv = new RdvModel({
                _idRdv: _idRdv,
                idClient: idClient,
                dateHeureDebut: dateHeureDebut,
                dateHeureFin: dateHeureFin,
                idEmploye: idEmploye,
                montantTotalPaye: montantTotal,
                etatFini: false
            });
            var newRdv = await rdv.save();
            res.status(200).send(newRdv);
        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous en ligne ", error.message);
            res.status(400).send(error);
        }
    },
    appointmentHistory: async(req, res) => {
        try {
            var idClient = req.session.client._idClient;
            const currentsRdvs = await RdvModel.find({ $and: [{idClient: idClient}, {etatFini: false}] }).sort({ dateHeureDebut: 1 }).exec();
            for (const currentsRdv of currentsRdvs) {
                currentsRdv.rdvService = await RdvServiceModel.find({ idRdv: currentsRdv._idRdv }).exec();
                for (const rdvService of currentsRdv.rdvService) {
                    rdvService.service = await ServiceModel.findOne({ _idService: rdvService.idService }).exec();
                }
            }
            res.status(200).send(currentsRdvs);
        } catch (error) {
            console.error("Erreur lors l'historique de de rendez-vous ", error.message);
            res.status(400).send(error);
        }
    },
    employePreference: async(req, res) => {
        try {
            var idClient = req.session.client._idClient;
            const counts = await RdvModel.aggregate([{$match: {idClient: idClient}}, {$group: {_id: "$idEmploye", count: {$sum: 1}}}, {$sort: {count: -1}}])
            const employees = [];
            for (const counter of counts) {
                const employee = await EmployeModel.findOne({ idEmploye: counter._id });
                employee.countPreference = counter.count;
                employees.push(employee);
            };
            res.status(200).send(employees);
        } catch (error) {
            console.error("Erreur lors la préférence d'employé", error.message);
            res.status(400).send(error);
        }
    }
};

module.exports = clientMethods;