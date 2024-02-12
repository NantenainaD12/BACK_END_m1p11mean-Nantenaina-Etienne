var ClientModel = require('../../Model/Clients/ClientModel')
const getNextSequence = require('../../Model/Counter/Counter'); 
var Authentification_client = {
    createClient: async(req,res) =>
    {
        try {
            const nom = req.body.nom;
            const prenom = req.body.prenom;
            const email = req.body.email;

            const ClientModelData = new ClientModel();
            ClientModelData._idClient = await getNextSequence('client'),
            ClientModelData.nom = nom;
            ClientModelData.prenom = prenom;
            ClientModelData.email = email;

            await ClientModelData.save();

            res.status(200).send({
                "status": true, "message": "mandee"
            });
            
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    GetAllClients: async(req,res) => {
        try {
            consol.log('aonaaa');
            const clients = await ClientModel.find();
            res.status(200).send(clients);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    DeleteQuotes: async(req,res) => {
        try {
            const name = req.query.name;
            await UserModel.deleteOne({ name: name });
            res.status(200).send({
                "status": true, 
                "message": "Quote deleted successfully"
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
    
    
}

module.exports = Authentification_client;


// var GetTest = async(req,res) =>
// {
//     console.log('tayy');
// }