const express = require('express');
const projectPageController = require('../controllers/projectPage.controller');

const router = express.Router();
router.put('/:id/moveScreens', projectPageController.moveProjectScreens);

module.exports = router;