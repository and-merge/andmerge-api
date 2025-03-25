const express = require('express');
const settingsController = require('../controllers/settings.controller');

const router = express.Router();
router.get('/getAllScreenBreakpointTypes', settingsController.getAllScreenBreakpointTypes);

module.exports = router;