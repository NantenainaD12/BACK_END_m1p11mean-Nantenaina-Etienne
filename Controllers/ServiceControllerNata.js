require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel')
var ServiceModel = require('../Model/Service/ServiceModel')
var OffreSpecialeModel = require('../Model/OffreSpeciale/OffreSpecialeModel')
const getNextSequence = require('../Model/Tools/Counter');


var Services_function = {
    CreateService: async (req, res) => {
        try {
            console.log("req.body.Photo = "+req.body.Photo);
            const newService = new ServiceModel({
                _idService: await getNextSequence('services'),
                description: req.body.description,
                Photo: req.body.Photo,
                dureeMinute: req.body.dureeMinute,
                prix: req.body.prix,
                commission: req.body.commission
            });

            const savedService = await newService.save();

            res.status(201).send(savedService);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    }
    ,
    GetAllServices: async (req, res) => {
        try {
            const services = await ServiceModel.find();
            res.status(200).send(services);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    UpdateService: async (req, res) => {
        try {
            const updatedService = await ServiceModel.findOneAndUpdate(
                { _idService: req.params.idService },
                { $set: req.body },
                { new: true, runValidators: true, omitUndefined: true }
            );

            if (!updatedService) {
                return res.status(404).send({
                    message: 'Service not found'
                });
            }

            res.status(200).send(updatedService);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    DeleteService: async (req, res) => {
        try {
            const deletedService = await ServiceModel.findOneAndDelete({ _idService: req.params.idService });

            if (!deletedService) {
                return res.status(404).send({
                    message: 'Service not found'
                });
            }

            res.status(200).send({
                message: 'Service deleted successfully',
                service: deletedService
            });
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    CreateOffreSpecial: async (req, res) => {
        try {
            console.log("create offre speciale");
            const newOffreSpecial = new OffreSpecialeModel({
                _idOffreSpeciale: await getNextSequence('offrespeciales'),
                description: req.body.description,
                dateDebut: req.body.dateDebut,
                dateFin: req.body.dateFin,
                idService: req.body.idService,
                pourcentageRemise: req.body.pourcentageRemise
            });

            const savedOffreSpecial = await newOffreSpecial.save();

            res.status(201).send(savedOffreSpecial);
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    DeleteOffreSpecial: async (req, res) => {
        try {
            console.log("delete offre speciale"+req.body._idOffreSpeciale);
            const deletedOffreSpecial = await OffreSpecialeModel.deleteOne({
                _idOffreSpeciale: parseInt(req.params.idOffreSpeciale)
            });
    
            if (deletedOffreSpecial.deletedCount === 0) {
                res.status(404).send({
                    message: "Offre spéciale non trouvée"
                });
            } else {
                res.status(200).send({
                    message: "Offre spéciale supprimée avec succès"
                });
            }
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    },
    getOffreSpecialValid: async (req, res) => {
        try {
            console.log("ttt "+req.query.dateBegin+" lll "+req.query.dateEnd);
            
            const dateBegin = new Date(req.query.dateBegin)  ? new Date(req.query.dateBegin) : new Date();
            const dateEnd = new Date(req.query.dateEnd)  ? new Date(req.query.dateEnd) : new Date();
            console.log("uuuu "+dateBegin+" fin "+dateEnd);
            const validOffreSpecials = await OffreSpecialeModel.find({
                dateDebut: { $lte: dateBegin },
                dateFin: { $gte: dateEnd }
            });
    
            if (!validOffreSpecials.length) {
                res.status(404).send({
                    message: "Aucune offre spéciale valide trouvée"
                });
            } else {
                for (let i = 0; i < validOffreSpecials.length; i++) {
                    const service = await ServiceModel.findOne({
                        _idService: parseInt(validOffreSpecials[i].idService)
                    });
                    if (service) {
                        validOffreSpecials[i] = validOffreSpecials[i].toObject();
                        validOffreSpecials[i].nomService = service. description;
                        console.log("cascsaf " + validOffreSpecials[i].nomService + " employe = " + service);
                    }
                }
                res.status(200).send(validOffreSpecials);
            }
        } catch (error) {
            res.status(500).send({
                message: error.message
            });
        }
    }
    
    
    

}


module.exports = Services_function;