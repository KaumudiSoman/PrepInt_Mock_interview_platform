const express = require('express');
const noteControlller = require('../controllers/noteController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .get(authController.protect, authController.verify, noteControlller.getAllNotes)
    .post(authController.protect, authController.verify, noteControlller.createNote);

router.route('/my-notes')
    .get(authController.protect, authController.verify, noteControlller.getUserNotes);

router.route('/favorite-notes')
    .get(authController.protect, authController.verify, noteControlller.getFavoriteNotes);

router.route('/:id')
    .get(authController.protect, authController.verify, noteControlller.getNoteById)
    .delete(authController.protect, authController.verify, noteControlller.deleteNoteById);

module.exports = router;