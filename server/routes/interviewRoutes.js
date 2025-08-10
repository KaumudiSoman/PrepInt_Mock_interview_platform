const express = require("express");
const interviewController = require('../controllers/interviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, interviewController.getAllInterviews);
    // .post(interviewController.createInterview);

router.route('/:id')
    .delete(authController.protect, authController.verify, interviewController.deleteInterview);
    
router.route('/my-interviews')
    .get(authController.protect, authController.verify, interviewController.getUserInterviews);

router.route('/favorite-interviews')
    .get(authController.protect, authController.verify, interviewController.getFavoriteInterviews);

router.route('/get-questions').post(interviewController.getQuestions);

module.exports = router;