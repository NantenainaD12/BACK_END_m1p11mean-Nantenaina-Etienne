require('dotenv').config();
var EmployeeModel = require('../Model/Employee/EmployeeModel')
var ServiceModel = require('../Model/Service/ServiceModel')
const getNextSequence = require('../Model/Tools/Counter');


var Services_function = {
    CreateService: async (req, res) => {
        try {
            const newService = new ServiceModel({
                _idService: await getNextSequence('services'),
                description: req.body.description,
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
    }
    
    

}


module.exports = Services_function;