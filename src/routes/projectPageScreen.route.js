const express = require('express');
const projectPageScreenController = require('../controllers/projectPageScreen.controller');

const router = express.Router();
router.get('/:id', projectPageScreenController.getProjectPageScreen);
router.get('/getAllByProjectPageId/:projectPageId', projectPageScreenController.getProjectPageScreensByProjectPageId);
router.put('/:id', projectPageScreenController.updateProjectPageScreen);
router.delete('/deleteScreens', projectPageScreenController.deleteProjectPageScreens);
router.post('/combineScreens', projectPageScreenController.combineProjectPageScreens);

module.exports = router;