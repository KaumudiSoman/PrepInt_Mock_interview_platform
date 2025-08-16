const express = require("express");
const interviewController = require('../controllers/interviewController');
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/interviewFeedbackController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, interviewController.getAllInterviews);
    
router.route('/my-interviews')
    .get(authController.protect, authController.verify, interviewController.getUserInterviews);

router.route('/favorite-interviews')
    .get(authController.protect, authController.verify, interviewController.getFavoriteInterviews);

router.route('/get-questions')
    .post(interviewController.getQuestions);

router.route('/feedback')
    .get(authController.protect, authController.verify, feedbackController.getAllFeedbacks)
    .post(authController.protect, authController.verify, feedbackController.createFeedback);

router.route('/feedback/:id')
    .get(authController.protect, authController.verify, feedbackController.getFeedbackById);

router.route('/:id')
    .get(authController.protect, authController.verify, interviewController.getInterviewById)
    .delete(authController.protect, authController.verify, interviewController.deleteInterviewById);

module.exports = router;