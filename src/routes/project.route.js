const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();
router.post('/create', projectController.createProject);
router.get('/:id', projectController.getSingle);
router.post('/:id/createPage', projectController.createPage);
router.get('/getByUserId/:userId', projectController.getByUserId);

module.exports = router;