const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.registrar);
router.post('/login', usersController.login);

module.exports = router;
