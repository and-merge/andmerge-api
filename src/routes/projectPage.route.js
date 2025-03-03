const express = require('express');
const projectPageController = require('../controllers/projectPage.controller');

const router = express.Router();
router.put('/:id', projectPageController.updatePage);
router.put('/:id/moveScreens', projectPageController.moveProjectScreens);
router.put('/:id/updateDocumentation', projectPageController.updateDocumentation);

module.exports = router;