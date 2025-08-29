const express = require("express");
const userInteractionController = require('../controllers/userInteractionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/interview/:interviewId')
    .get(authController.protect, authController.verify, userInteractionController.getInterviewInteraction)
    .put(authController.protect, authController.verify, userInteractionController.updateInterviewInteraction);

router.route('/note/:noteId')
    .get(authController.protect, authController.verify, userInteractionController.getNoteInteraction)
    .put(authController.protect, authController.verify, userInteractionController.updateNoteInteraction);

module.exports = router;