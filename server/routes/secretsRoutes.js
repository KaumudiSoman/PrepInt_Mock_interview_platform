const express = require("express");
const secretsController = require('../controllers/secretsController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, secretsController.getSecrets);

module.exports = router;