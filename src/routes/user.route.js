const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();
router.post('/create', userController.createUser);
router.get('/getByEmail/:email', userController.getUserByEmail);

module.exports = router;