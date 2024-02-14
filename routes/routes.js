const express = require('express');
const router = express.Router();
<<<<<<< HEAD
var clientController = require('../Controllers/ClientController')

// CLIENT
router.route('/client/signin').post(clientController.signInClient);
router.route('/client/homepage').get(clientController.homepageClient);
router.route('/client/logout').get(clientController.logoutClient);
router.route('/client/login').get(clientController.loginClient);
router.route('/client/new').post(clientController.createAccountClient);
router.route('/client/online_booking').post(clientController.onlineAppointmentBooking);
=======
var Con_Emp_auth = require ('../Controllers/EmployesController')
var authenticateToken = require('../Model/Tools/TokenManager');


router.route('/Employe/createEmployee').post(Con_Emp_auth.createEmployee);
router.route('/Employe/LoginEmployee').post(Con_Emp_auth.Login_Employee);
router.route('/Employe/updateEmployee/:idEmploye').post(Con_Emp_auth.updateEmployee);
router.route('/Employe/GetAllEmployee').get(authenticateToken,Con_Emp_auth.GetAllEmployee);

>>>>>>> Naintenaina2

module.exports = router;