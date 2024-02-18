const express = require('express');
const router = express.Router();
var clientController = require('../Controllers/ClientController')
var ServiceController = require('../Controllers/ServiceControllerNata')
var StatistiqueController = require('../Controllers/StatistiqueController')
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
router.route('/Employe/rdvs/:idEmploye').get(authenticateToken,Con_Emp_auth.getRdvsByIdEmploye);
router.route('/Employe/rdvs_done_daily/:idEmploye').get(Con_Emp_auth.getRdvsDONEByIdEmploye_groupByDAY);
router.route('/Employe/rdvs_done_daily_with_commission/:idEmploye').get(Con_Emp_auth.getCommissionByidEmployeeDaily);

//Manager
router.route('/Manager/GetAllServices').get(ServiceController.GetAllServices);
router.route('/Manager/CreateService').post(ServiceController.CreateService);
router.route('/Manager/UpdateService/:idService').post(ServiceController.UpdateService);
router.route('/Manager/DeleteService/:idService').post(ServiceController.DeleteService);

//Manager Statistiques
router.route('/Manager/CoutReservation_Day_month').post(StatistiqueController.CoutReservation_Day_month);
router.route('/Manager/CoutReservation_By_month').post(StatistiqueController.CoutReservation_By_month);
router.route('/Manager/ChiffreAffaireParJour').post(StatistiqueController.ChiffreAffaireParJour);
router.route('/Manager/ChiffreAffaireParMois').post(StatistiqueController.ChiffreAffaireParMois);
router.route('/Manager/Get_benfice_monthly').post(StatistiqueController.Get_benfice_monthly);

module.exports = router;