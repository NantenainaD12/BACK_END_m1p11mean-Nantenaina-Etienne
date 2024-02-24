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
            res.status(400).send("Erreur lors de l'authentification du client, ", error.message);
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
            res.status(400).send("Erreur dans la page d'accueil du client, ", error.message);
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
            res.status(200).send(newClient);
        } catch (error) {
            res.status(400).send("Erreur lors de la création du compte client, ", error.message);
        }
    },
    onlineAppointmentBooking: async(req, res) => {
        try {
            var _idRdv = 0;
            var idClient = parseInt(req.query.idClient);
            var dateHeureDebut = new Date(req.body.dateHeureDebut);
            var idEmploye = req.body.idEmploye;
            if (dateHeureDebut.getTime() < new Date().getTime()) {
                res.status(400).send('Invalid debut date');
                return;
            }
            const rdvsEmploye = await RdvModel.find({ idEmploye: idEmploye });
            for (const rdvEmploye of rdvsEmploye) {
                if (rdvEmploye.dateHeureDebut <= dateHeureDebut && dateHeureDebut <= rdvEmploye.dateHeureFin) {
                    res.status(400).send('The employee won\'t be available during that time');
                    return;
                }
            }
            _idRdv = await getNextSequence('rdvs');
            var idServices = req.body.idServices.split(",").map(Number);
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
                        rdvService.prixApresRemise = service.prix * (1 - offreSpeciale.pourcentageRemise);
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
            res.status(400).send("Erreur lors de la prise de rendez-vous en ligne, ", error.message);
        }
    },
    appointmentHistory: async(req, res) => {
        try {
            var idClient = parseInt(req.query.idClient);
            const rdvs = [];
            const currentsRdvs = await RdvModel.find({ idClient: idClient }).sort({ etatFini: 1, dateHeureDebut: 1 });
            for (const currentsRdv of currentsRdvs) {
                var services = [];
                var rdvServices = await RdvServiceModel.find({ idRdv: currentsRdv._idRdv });
                for (const rdvService of rdvServices) {
                    services.push({ 'rdvservice': rdvService, 'service': await ServiceModel.findOne({ _idService: rdvService.idService }), 'offrespeciale': await OffreSpecialeModel.findOne({ _idOffreSpeciale: rdvService.idOffreSpeciale }) });
                }
                rdvs.push({ 'rdv': currentsRdv, 'employe': await EmployeModel.findOne({ idEmploye: currentsRdv.idEmploye }), 'services': services });
            }
            res.status(200).send(rdvs);
        } catch (error) {
            res.status(400).send("Erreur lors de l'historique de de rendez-vous, ", error.message);
        }
    },
    employePreference: async(req, res) => {
        try {
            var idClient = parseInt(req.query.idClient);
            const counts = await RdvModel.aggregate([{ $match: { idClient: idClient } }, { $group: { _id: "$idEmploye", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
            const employees = [];
            for (const counter of counts) {
                const employee = await EmployeModel.findOne({ idEmploye: counter._id });
                employees.push({ 'employe': employee, 'count': counter.count });
            };
            res.status(200).send(employees);
        } catch (error) {
            res.status(400).send("Erreur lors de la préférence d'employé, ", error.message);
        }
    },
    servicePreference: async(req, res) => {
        try {
            var idClient = parseInt(req.query.idClient);
            const idrdvs = await RdvModel.find({ idClient: idClient }, { _id: 0, _idRdv: 1 });
            var idServicesWithCounts = [];
            for (const idrdv of idrdvs) {
                const counters = await RdvServiceModel.aggregate([{ $match: { idRdv: idrdv._idRdv } }, { $group: { _id: "$idService", count: { $sum: 1 } } }])
                idServicesWithCounts.push(counters);
            }
            const results = {};
            for (const subArray of idServicesWithCounts) {
                for (const element of subArray) {
                    const id = element._id;
                    if (!results.hasOwnProperty(id)) {
                        results[id] = { _id: id, count: 0 };
                    }
                    results[id].count += element.count;
                }
            }
            const sortedCounterResults = Object.values(results).sort((a, b) => b.count - a.count);
            const services = [];
            for (const counter of sortedCounterResults) {
                const service = await ServiceModel.findOne({ _idService: counter._id });
                services.push({ 'service': service, 'count': counter.count });
            };
            res.status(200).send(services);
        } catch (error) {
            res.status(400).send("Erreur lors de la préférence de service, ", error.message);
        }
    },
    appointmentReminder: async(req, res) => {
        try {
            var idClient = req.session.client._idClient;
            const myRdvsNotPayed = await RdvModel.find({ idClient: idClient, dateHeureDebut: { $gte: new Date() }, etatFini: false }).sort({ dateHeureDebut: 1 });
            res.status(200).send(myRdvsNotPayed);
        } catch (error) {
            console.error("Erreur lors du rappel des rendez-vous, ", error.message);
            res.status(400).send(error);
        }
    },
    specialOffersNotifications: async(req, res) => {
        try {
            now = new Date();
            const offreSpeciales = await OffreSpecialeModel.find({}).sort({ dateDebut: 1 });
            const offers = [];
            for (const offreSpeciale of offreSpeciales) {
                if (offreSpeciale.dateDebut <= now && now <= offreSpeciale.dateFin) {;
                    offers.push({ 'offreSpeciale': offreSpeciale, 'service': await ServiceModel.findOne({ _idService: offreSpeciale.idService }) });
                }
            };
            res.status(200).send(offers);
        } catch (error) {
            res.status(400).send("Erreur lors de la préférence de service, ", error.message);
        }
    },
    onlinePayment: async(req, res) => {
        try {
            const idRdv = parseInt(req.query.idRdv);
            now = new Date();
            await RdvModel.updateOne({ _idRdv: idRdv }, { $set: { datePayement: now, etatFini: true } });
            const rdv = await RdvModel.find({ _idRdv: idRdv });
            res.status(200).send(rdv);
        } catch (error) {
            res.status(400).send("Erreur lors du paiement en ligne, ", error.message);
        }
    }
};

module.exports = clientMethods;