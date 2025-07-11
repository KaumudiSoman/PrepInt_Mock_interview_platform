const express = require("express");
const interviewController = require('../controllers/interviewController');

const router = express.Router();

router.route('/')
    .get(interviewController.getAllInterviews);
    // .post(interviewController.createInterview);

router.route('/get-questions').post(interviewController.getQuestions);

module.exports = router;