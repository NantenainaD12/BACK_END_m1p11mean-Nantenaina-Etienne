var EmployeeModel = require('../../Model/Employee/EmployeeModel')
const getNextSequence = require('../../Model/Counter/Counter'); 
var Emp_authentification = {
    createEmployee: async(req,res) =>
    {
        try {
            const nom = req.body.nom;
            const prenom = req.body.prenom;
            const email = req.body.email;
            const salaire = req.body.salaire;

            const EmployeeModelData = new EmployeeModel();
            EmployeeModelData._idEmployee = await getNextSequence('employee'),
            EmployeeModelData.nom = nom;
            EmployeeModelData.prenom = prenom;
            EmployeeModelData.email = email;
            EmployeeModelData.salaire = salaire;

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
    }
    
    
}

module.exports = Emp_authentification;


// var GetTest = async(req,res) =>
// {
//     console.log('tayy');
// }