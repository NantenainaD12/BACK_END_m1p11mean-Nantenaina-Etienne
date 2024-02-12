var ClientModel = require('../Model/Clients/ClientModel')
const getNextSequence = require('../Model/Counter/Counter');
var clientAuthentification = {
    signInClient: async(req, res) => {
        try {
            console.log("Created");
            var client = new ClientModel();
            res.status(200).send("OK");
            // const mail = req.body.mail;
            // const mdp = req.body.mdp;

            // ClientModel.findOne({ mail: mail, mdp: mdp }, (err, client) => {
            //     if (err) {
            //         // Gérer l'erreur
            //         console.error("Erreur lors de la recherche du client:", err);
            //         // Renvoyer une réponse appropriée à l'utilisateur, par exemple une erreur 500
            //         res.status(500).send("Une erreur s'est produite lors de la recherche du client.");
            //     } else {
            //         if (client) {
            //             // Si un client correspond aux critères de recherche, vous pouvez accéder à ses propriétés
            //             console.log("Client trouvé :", client);
            //             // Faire quelque chose avec le client trouvé, par exemple renvoyer une réponse contenant les détails du client
            //             res.status(200).json(client);
            //         } else {
            //             // Si aucun client ne correspond aux critères de recherche, renvoyer une réponse appropriée à l'utilisateur, par exemple une erreur 404
            //             res.status(404).send("Aucun client trouvé avec cet e-mail et ce mot de passe.");
            //         }
            //     }
            // });

        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    }
}

module.exports = clientAuthentification;