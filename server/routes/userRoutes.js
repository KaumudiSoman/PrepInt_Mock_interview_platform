const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const emailController = require('./../controllers/emailController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.get('/verification/:token', emailController.verifyEmail);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

router.route('/').get(authController.protect, authController.verify, authController.hasPermission('ADMIN'), userController.getAllUsers);
router.route('/:id')
    .get(authController.protect, authController.verify, authController.hasPermission('ADMIN'), userController.getUser)
    .patch(authController.protect, authController.verify, authController.hasPermission('ADMIN'), userController.updateUser)
    .delete(authController.protect, authController.verify, authController.hasPermission('ADMIN', 'USER'), userController.deleteUser);

module.exports = router;