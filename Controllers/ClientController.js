var ClientModel = require('../Model/Client/ClientModel');
const getNextSequence = require('../Model/Counter/Counter');

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
    logoutClient: async(req, res) => { // Deconnexion du
        if (req.session.client) {
            // Supprimer la session client
            delete req.session.client;
            res.status(200).send("Compte client deconnecté");
        } else {
            res.status(400).send("Erreur lors de la déconnexion");
        }
    },
    loginClient: async(req, res) => { // Login client
        res.status(200).send("Login");
    },
    createAccountClient: async(req, res) => { // S'inscrire
        try {
            var client = new ClientModel({
                _idClient: await getNextSequence('client'),
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

};

module.exports = clientMethods;