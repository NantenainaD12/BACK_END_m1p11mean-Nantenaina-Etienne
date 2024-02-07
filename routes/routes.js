const express = require('express');
const router = express.Router();
var Authentification_client = require ('../Controllers/Controller_Client/Con_Authentification')
var Con_Emp_auth = require ('../Controllers/Controller_Employee/Con_Emp_auth')

router.route('/user/createClient').post(Authentification_client.createClient);
router.route('/get_all_client').get(Authentification_client.GetAllClients);

router.route('/user/createEmployee').post(Con_Emp_auth.createEmployee);
router.route('/GetAllEmployee').get(Con_Emp_auth.GetAllEmployee);

router.route('/Delete_quote').delete(Authentification_client.DeleteQuotes);

module.exports = router;