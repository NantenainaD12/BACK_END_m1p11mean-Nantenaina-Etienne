const express = require('express');
const router = express.Router();
var Authentification_client = require ('../Controllers/Controller_Client/Con_Authentification')
var Con_Emp_auth = require ('../Controllers/EmployesController')
var authenticateToken = require('../Model/Tools/TokenManager');

router.route('/user/createClient').post(Authentification_client.createClient);
router.route('/get_all_client').get(Authentification_client.GetAllClients);

router.route('/Employe/createEmployee').post(Con_Emp_auth.createEmployee);
router.route('/Employe/LoginEmployee').post(Con_Emp_auth.Login_Employee);
router.route('/Employe/updateEmployee/:idEmploye').post(Con_Emp_auth.updateEmployee);
router.route('/Employe/GetAllEmployee').get(authenticateToken,Con_Emp_auth.GetAllEmployee);

router.route('/Delete_quote').delete(Authentification_client.DeleteQuotes);

module.exports = router;