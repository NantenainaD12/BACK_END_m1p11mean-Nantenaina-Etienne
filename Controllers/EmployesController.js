require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel')
const getNextSequence = require('../Model/Tools/Counter');
const Rdv = require('../Model/Rdv/RdvModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    updateEmployee: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye; // récupérer le idEmploye du paramètre de la route
            const nom = req.body.nom;
            const email = req.body.email;
            const mdp = req.body.mdp;
            const pdp = req.body.pdp;
            const horaireDebut = req.body.horaireDebut;
            const horaireFin = req.body.horaireFin;

            const mdpHashed = mdp ? await hashPassword(mdp) : undefined;

            // Construire l'objet de mise à jour
            let updateObj = {};
            if (nom) updateObj.nom = nom;
            if (mdpHashed) updateObj.mdp = mdpHashed;
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
                message: 'Internal server error'
            });
        }
    },
    getRdvsByIdEmploye: async (req, res) => {
        try {
            const idEmploye = req.params.idEmploye;
            console.log("id = " + idEmploye);
            const rdvs = await Rdv.getRdvsByIdEmploye(idEmploye);
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
            const startOfDay = req.body.datedebut ? new Date(req.body.datedebut) : new Date();
            const endOfDay = new Date(req.body.datefin);
            if (isNaN(startOfDay) || isNaN(endOfDay)) {
                return res.status(400).send({
                    message: 'Invalid date format'
                });
            }
            const rdvs = await Rdv.getCommissionByidEmployeeDaily(idEmploye, startOfDay, endOfDay);

            res.status(200).json(rdvs);
        } catch (error) {
            res.status(500).send({
                message: error.message
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