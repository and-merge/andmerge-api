const express = require('express');
const projectPageScreenController = require('../controllers/projectPageScreen.controller');

const router = express.Router();
router.delete('/deleteScreens', projectPageScreenController.deleteProjectPageScreens);

module.exports = router;