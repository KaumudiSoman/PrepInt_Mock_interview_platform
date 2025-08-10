const express = require("express");
const userInteractionController = require('../controllers/userInteractionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/:interviewId')
    .get(authController.protect, authController.verify, userInteractionController.getUserInteraction)
    .put(authController.protect, authController.verify, userInteractionController.updateUserInteraction);

module.exports = router;