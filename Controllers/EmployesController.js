require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel');
var RdvServiceModel = require('../Model/RdvService/RdvServiceModel');
const getNextSequence = require('../Model/Tools/Counter');
const Rdv = require('../Model/Rdv/RdvModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ServiceModel = require('../Model/Service/ServiceModel');
const ClientModel = require('../Model/Client/ClientModel');

var Emp_authentification = {
    createEmployee: async (req, res) => {
        try {
            const nom = req.body.nom;
            const email = req.body.email;
            const mdp = req.body.mdp;
            const pdp = req.body.pdp;
            const horaireDebut = req.body.horaireDebut;
            const horaireFin = req.body.horaireFin;

            const mdpHashed = await hashPassword(mdp);

            const EmployeeModelData = new EmployeeModel();
            EmployeeModelData.idEmploye = await getNextSequence('Employe'),
                EmployeeModelData.nom = nom;
            EmployeeModelData.mdp = mdpHashed;
            EmployeeModelData.email = email;
            EmployeeModelData.pdp = pdp;
            EmployeeModelData.horaireDebut = horaireDebut;
            EmployeeModelData.horaireFin = horaireFin;
            EmployeeModelData.salaire = 12.5;

            await EmployeeModelData.save();

            res.status(200).send({
                "status": true,
                "message": "mandee"
            });

        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    GetAllEmployee: async (req, res) => {
        try {
            const clients = await EmployeeModel.find();
            console.log(" GET ALL EMPLOYE");
            res.status(200).send(clients);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    getEmployeById: async (req, res) => {
        const id = req.params.idEmploye;
        try {
            // const employee = await EmployeeModel.findById(id);
            const employee = await EmployeeModel.find({
                idEmploye: id
            });
            if (!employee) {
                return res.status(404).send({
                    message: "Employé non trouvé avec l'id " + id
                });
            }
            res.status(200).send(employee);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Error Employé non trouvé avec l'id " + id + " error = " + error.message
                });
            }
            return res.status(500).send({
                message: "Erreur lors de la récupération de l'employé avec l'id " + id
            });
        }
    },
    updateEmployee: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye; // récupérer le idEmploye du paramètre de la route
            const nom = req.body.nom;
            const email = req.body.email;
            const mdp = req.body.mdp;
            const pdp = req.body.pdp; // Convertir le fichier en base64

            const horaireDebut = req.body.horaireDebut;
            const horaireFin = req.body.horaireFin;

            const mdpHashed = mdp ? await hashPassword(mdp) : undefined;
            // console.log("padp= "+pdp+" mdp= "+mdpHashed);

            // Construire l'objet de mise à jour
            let updateObj = {};
            if (nom) updateObj.nom = nom;
            //if (mdpHashed) updateObj.mdp = mdpHashed;
            if (email) updateObj.email = email;
            if (pdp) updateObj.pdp = pdp;
            if (horaireDebut) updateObj.horaireDebut = horaireDebut;
            if (horaireFin) updateObj.horaireFin = horaireFin;

            // trouver l'employé par son idEmploye et mettre à jour ses données
            const updatedEmployee = await EmployeeModel.findOneAndUpdate({
                idEmploye: idEmploye
            }, {
                $set: updateObj
            }, {
                new: true
            });

            res.status(200).send({
                "status": true,
                "message": "Profil mis à jour",
                "updatedEmployee": updatedEmployee
            });

        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    DeleteQuotes: async (req, res) => {
        try {
            const name = req.query.name;
            await UserModel.deleteOne({
                name: name
            });
            res.status(200).send({
                "status": true,
                "message": "Quote deleted successfully"
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },

    Login_Employee: async (req, res) => {
        try {
            const email = req.body.email;
            const mdp = req.body.mdp;
            console.log("email = "+email+" mdp= "+mdp);

            const employee = await EmployeeModel.findOne({
                email: email
            });
            if (!employee) {
                return res.status(404).json({
                    message: 'Employee not found'
                });
            }
            const isMdptrue = await employee.authenticate(mdp);
            if (!isMdptrue) {
                return res.status(401).json({
                    message: 'Incorrect password'
                });
            }

            // Authentification réussie
            const secret_key = process.env.SECRET_KEY;
            const token = jwt.sign({
                id: employee._id
            }, secret_key, {
                expiresIn: '1h'
            });
            return res.status(200).json({
                message: 'Login successful',
                employee: employee,
                token: token
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Internal server error mesage= '+res.message
            });
        }
    },
    getRdvsByIdEmploye: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye;
            const rdvs = await Rdv.getRdvsByIdEmploye(idEmploye);

            // Faire une boucle sur chaque rdv
            for (let i = 0; i < rdvs.length; i++) {
                // Obtenir l'employé correspondant
                const employee = await ClientModel.findOne({
                    _idClient: parseInt(rdvs[i].idClient)
                });
                if (employee) {
                    // Ajouter le nom de l'employé à rdv
                    rdvs[i] = rdvs[i].toObject(); // Convertir le document Mongoose en objet JavaScript
                    rdvs[i].employeeName = employee.nom;
                }
            }

            res.status(200).json(rdvs);

        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    updateEtatFini: async (req, res) => {
        try {
            const idRdv = req.params.idRdv;
            const newEtatFini = req.body.etatFini;
            const rdvs = await Rdv.updateEtatFini(idRdv, newEtatFini);
            res.status(200).json(rdvs);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    getRdvsDONEByIdEmploye_groupByDAY: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye;
            const startOfDay = new Date(req.body.datedebut);
            const endOfDay = new Date(req.body.datefin);
            if (isNaN(startOfDay) || isNaN(endOfDay)) {
                return res.status(400).send({
                    message: 'Invalid date format'
                });
            }
            const rdvs = await Rdv.getRdvsDONEByIdEmploye_groupByDAY(idEmploye, startOfDay, endOfDay);
            res.status(200).json(rdvs);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    getCommissionByidEmployeeDaily: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye;
            const startOfDay = new Date(req.query.datedebut) ? new Date(req.query.datedebut) : new Date();
            const endOfDay = new Date(req.query.datefin) ? new Date(req.query.datedebut) : new Date();
            if (isNaN(startOfDay)) {
                return res.status(400).send({
                    message: 'Invalid date format'
                });
            }
            const rdvs = await Rdv.getCommissionByidEmployeeDaily(idEmploye, startOfDay, endOfDay);

            // Faire une boucle sur chaque rdv
            for (let i = 0; i < rdvs.length; i++) {
                // Obtenir l'employé correspondant
                const employee = await ClientModel.findOne({
                    _idClient: parseInt(rdvs[i].idClient)
                });
                if (employee) {
                    // Ajouter le nom de l'employé à rdv
                    // rdvs[i] = rdvs[i].toObject(); // Convertir le document Mongoose en objet JavaScript
                    rdvs[i].employeeName = employee.nom;
                }
            }

            res.status(200).json(rdvs);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    getRdvServiceBy_idRdv: async (req, res) => {
        const idRdv = req.params.idRdv;
        try {
            const rdvServices = await RdvServiceModel.find({
                idRdv: idRdv
            });
            if (!rdvServices) {
                return res.status(404).send({
                    message: "RDV service not found " + idRdv
                });
            }

            // Faire une boucle sur chaque rdvService
            for (let i = 0; i < rdvServices.length; i++) {
                // Obtenir le service correspondant
                const service = await ServiceModel.findOne({
                    _idService: rdvServices[i].idService
                });
                if (service) {
                    // Ajouter la description du service à rdvService
                    rdvServices[i] = rdvServices[i].toObject(); // Convertir le document Mongoose en objet JavaScript
                    rdvServices[i].serviceDescription = service.description;
                }
            }

            res.status(200).send(rdvServices);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Error Rdv Service not found with id " + idRdv + " error = " + error.message
                });
            }
            return res.status(500).send({
                message: "Erreur lors de la récupération de l'employé avec l'id " + idRdv + " error = " + error.message
            });
        }
    }


}

async function hashPassword(password) {
    try {
        // Générez un sel (salt) pour renforcer la sécurité
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Erreur lors du hachage du mot de passe :', error);
        throw error;
    }
}

// function generateSecretKey(length) {

//     return crypto.randomBytes(length).toString('hex');
// }


module.exports = Emp_authentification;