var ClientModel = require('../Model/Client/ClientModel');
var ServiceModel = require('../Model/Service/ServiceModel');
var RdvModel = require('../Model/Rdv/RdvModel');
var RdvServiceModel = require("../Model/RdvService/RdvServiceModel");
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
            console.log(error);
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
            console.log(error);
            res.status(400).send(error);
        }
    },
    logoutClient: async(req, res) => {
        if (req.session.client) {
            // Supprimer la session client
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
            console.error("Erreur lors de la création du compte client :", error);
            res.status(400).send(error);
        }
    },
    onlineAppointmentBooking: async(req, res) => {
        try {
            var _idRdv = await getNextSequence('rdvs');
            var idClient = req.session.client._idClient;
            var dateHeureDebut = new Date(req.body.dateHeureDebut);
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
                // TODO : IF COMPRIS DANS UNE OFFRE SPECIALE : update prixApresRemise and montantCommission
                minutes += service.dureeMinute;
                montantTotal += rdvService.prixApresRemise;
                // var newRdvService = await rdvService.save();
                console.log("New Rdv => Service : ", rdvService);
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
            res.status(200).send(rdv);
        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous en ligne : ", error);
            res.status(400).send(error);
        }
    }
};

module.exports = clientMethods;