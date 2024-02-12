var EmployeeModel = require('../../Model/Employee/EmployeeModel')
const getNextSequence = require('../../Model/Counter/Counter'); 
const bcrypt = require('bcrypt');
var Emp_authentification = {
    createEmployee: async(req,res) =>
    {
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
                "status": true, "message": "mandee"
            });
            
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    GetAllEmployee: async(req,res) => {
        try {
            const clients = await EmployeeModel.find();
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
    },

    Login_Employee: async (req, res) => {
        try {
            const email = req.body.email;
            const mdp = req.body.mdp;
    
            // Votre logique d'authentification ici...
    
            // Recherchez l'employé par e-mail
            const employee = await EmployeeModel.findOne({ email: email });
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            const isMdptrue = await employee.authenticate(mdp);
            if (!isMdptrue) {
                return res.status(401).json({ message: 'Incorrect password' });
            }
    
            // Authentification réussie
            return res.status(200).json({ message: 'Login successful', employee: employee });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
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

module.exports = Emp_authentification;
