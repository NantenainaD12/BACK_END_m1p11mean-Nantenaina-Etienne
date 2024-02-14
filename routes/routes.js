const express = require('express');
const router = express.Router();
var clientController = require('../Controllers/ClientController')
var Con_Emp_auth = require ('../Controllers/EmployesController')
var authenticateToken = require('../Model/Tools/TokenManager')

// CLIENT
router.route('/client/signin').post(clientController.signInClient);
router.route('/client/homepage').get(clientController.homepageClient);
router.route('/client/logout').get(clientController.logoutClient);
router.route('/client/login').get(clientController.loginClient);
router.route('/client/new').post(clientController.createAccountClient);
router.route('/client/online_booking').post(clientController.onlineAppointmentBooking);



router.route('/Employe/createEmployee').post(Con_Emp_auth.createEmployee);
router.route('/Employe/LoginEmployee').post(Con_Emp_auth.Login_Employee);
router.route('/Employe/updateEmployee/:idEmploye').post(Con_Emp_auth.updateEmployee);
router.route('/Employe/GetAllEmployee').get(authenticateToken,Con_Emp_auth.GetAllEmployee);
router.route('/Employe/rdvs/:idEmploye').get(Con_Emp_auth.getRdvsByIdEmploye);


module.exports = router;