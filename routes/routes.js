const express = require('express');
const router = express.Router();
var clientController = require('../Controllers/ClientController')

// CLIENT
router.route('/client/signin').post(clientController.signInClient);
router.route('/client/homepage').get(clientController.homepageClient);
router.route('/client/logout').get(clientController.logoutClient);
router.route('/client/login').get(clientController.loginClient);
router.route('/client/new').post(clientController.createAccountClient);

module.exports = router;