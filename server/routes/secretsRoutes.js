const express = require("express");
const secretsController = require('../controllers/secretsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, secretsController.getSecrets);

module.exports = router;