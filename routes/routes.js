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
router.route('/client/appointment_booking').post(clientController.onlineAppointmentBooking);
router.route('/client/appointment_history').get(clientController.appointmentHistory);
router.route('/client/employe_preference').get(clientController.employePreference);
router.route('/client/service_preference').get(clientController.servicePreference);
router.route('/client/appointment_reminder').get(clientController.appointmentReminder);
router.route('/client/special_offers_notifications').get(clientController.specialOffersNotifications);
router.route('/client/online_payment').get(clientController.onlinePayment);
router.route('/client/online_booking').post(clientController.onlineAppointmentBooking);

// EMPLOYE
router.route('/Employe/createEmployee').post(Con_Emp_auth.createEmployee);
router.route('/Employe/LoginEmployee').post(Con_Emp_auth.Login_Employee);
router.route('/Employe/updateEmployee/:idEmploye').post(Con_Emp_auth.updateEmployee);
router.route('/Employe/GetAllEmployee').get(authenticateToken,Con_Emp_auth.GetAllEmployee);
router.route('/Employe/rdvs/:idEmploye').get(authenticateToken,Con_Emp_auth.getRdvsByIdEmploye);
router.route('/Employe/rdvs_done_daily/:idEmploye').get(Con_Emp_auth.getRdvsDONEByIdEmploye_groupByDAY);
router.route('/Employe/rdvs_done_daily_with_commission/:idEmploye').get(Con_Emp_auth.getCommissionByidEmployeeDaily);

module.exports = router;