var ClientModel = require('../Model/Clients/ClientModel');

var clientAuthentification = {
    signInClient: async(req, res) => {
        try {
            const email = req.body.email;
            const mdp = req.body.mdp;
            const client = await ClientModel.findOne({ email: email, mdp: mdp });
            if (client) {
                req.session.client = client;
                res.status(200).send(client);
            } else {
                res.status(404).send("Client non authentifié");
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
        req.session.destroy((err) => {
            if (err) {
                console.error("Erreur lors de la destruction de la session :", err);
                res.status(500).send("Erreur lors de la déconnexion");
            } else {
                res.redirect('/client/login');
            }
        });
    },
    loginClient: async(req, res) => {
        res.status(200).send("Login");
    }
};

module.exports = clientAuthentification;