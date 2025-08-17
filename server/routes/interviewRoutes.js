const express = require("express");
const interviewController = require('../controllers/interviewController');
const authController = require('../controllers/authController');
const feedbackController = require('../controllers/interviewFeedbackController');
const attemptsController = require('../controllers/attemptsController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, interviewController.getAllInterviews);
    
router.route('/my-interviews')
    .get(authController.protect, authController.verify, interviewController.getUserInterviews);

router.route('/favorite-interviews')
    .get(authController.protect, authController.verify, interviewController.getFavoriteInterviews);

router.route('/get-questions')
    .post(interviewController.getQuestions);

router.route('/attempts')
    .post(authController.protect, authController.verify, attemptsController.createAttempt);

router.route('/feedback')
    .get(authController.protect, authController.verify, feedbackController.getAllFeedbacks)
    .post(authController.protect, authController.verify, feedbackController.createFeedback);

router.route('/feedback/:id')
    .get(authController.protect, authController.verify, feedbackController.getFeedbackById);

router.route('/:interviewId/attempts/count')
    .get(authController.protect, authController.verify, attemptsController.getAttemptCount);

router.route('/:interviewId/attempts/:attemptId/number')
    .get(authController.protect, authController.verify, attemptsController.getAttemptNumber);

router.route('/:id')
    .get(authController.protect, authController.verify, interviewController.getInterviewById)
    .delete(authController.protect, authController.verify, interviewController.deleteInterviewById);

module.exports = router;