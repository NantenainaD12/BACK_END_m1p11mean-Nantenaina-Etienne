const express = require('express');
const multer = require("multer");
const upload = multer(); // Utilise le stockage en mémoire
const router = express.Router();
var clientController = require('../Controllers/ClientController')
var ServiceController = require('../Controllers/ServiceControllerNata')
var StatistiqueController = require('../Controllers/StatistiqueController')
var Con_Emp_auth = require('../Controllers/EmployesController')
var authenticateToken = require('../Model/Tools/TokenManager')

// CLIENT
router.route('/client/signin').post(multer().none(), clientController.signInClient);
router.route('/client/homepage').get(clientController.homepageClient);
router.route('/client/logout').get(clientController.logoutClient);
router.route('/client/login').get(clientController.loginClient);
router.route('/client/new').post(multer().none(), clientController.createAccountClient);
router.route('/client/appointment_booking').post(multer().none(), clientController.onlineAppointmentBooking);
router.route('/client/appointment_history').get(clientController.appointmentHistory);
router.route('/client/employe_preference').get(clientController.employePreference);
router.route('/client/service_preference').get(clientController.servicePreference);
router.route('/client/appointment_reminder').get(clientController.appointmentReminder);
router.route('/client/special_offers_notifications').get(clientController.specialOffersNotifications);
router.route('/client/online_payment').get(clientController.onlinePayment);
router.route('/client/online_booking').post(multer().none(), clientController.onlineAppointmentBooking);

// EMPLOYE
router.route('/Employe/createEmployee').post(multer().none(),Con_Emp_auth.createEmployee);
router.route('/Employe/LoginEmployee').post(multer().none(),Con_Emp_auth.Login_Employee);
router.route('/Employe/updateEmployee/:idEmploye').post(authenticateToken, Con_Emp_auth.updateEmployee);
router.route('/Employe/GetAllEmployee').get( Con_Emp_auth.GetAllEmployee);
router.route('/Employe/getEmployeById/:idEmploye').get(authenticateToken, Con_Emp_auth.getEmployeById);
router.route('/Employe/rdvs/:idEmploye').get( Con_Emp_auth.getRdvsByIdEmploye);
router.route('/Employe/rdvs_done_daily/:idEmploye').get(Con_Emp_auth.getRdvsDONEByIdEmploye_groupByDAY);
router.route('/Employe/rdvs_done_daily_with_commission/:idEmploye').get(Con_Emp_auth.getCommissionByidEmployeeDaily);
router.route('/Employe/updateEtatFini/:idRdv').put( Con_Emp_auth.updateEtatFini);

///rdv service
router.route('/Employe/getRdvServiceBy_idRdv/:idRdv').get(Con_Emp_auth.getRdvServiceBy_idRdv);


//Manager
router.route('/Manager/DeleteOffreSpecial/:idOffreSpeciale').get(ServiceController.DeleteOffreSpecial);
router.route('/Manager/getOffreSpecialValid/:idTsyilaina').get(ServiceController.getOffreSpecialValid);
router.route('/Manager/CreateOffreSpecial').post(ServiceController.CreateOffreSpecial);
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


//depense

router.route('/Manager/CreateDepense').post(StatistiqueController.CreateDepense);
router.route('/Manager/GetDepensemonthly').post(StatistiqueController.GetDepensemonthly);



module.exports = router;