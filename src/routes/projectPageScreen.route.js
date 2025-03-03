const express = require('express');
const projectPageScreenController = require('../controllers/projectPageScreen.controller');

const router = express.Router();
router.get('/:id', projectPageScreenController.getSingle);
router.delete('/deleteScreens', projectPageScreenController.deleteProjectPageScreens);
router.post('/combineScreens', projectPageScreenController.combineProjectPageScreens);
router.put('/:id/updateDocumentation', projectPageScreenController.updateDocumentation);

module.exports = router;