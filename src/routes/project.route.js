const express = require('express');
const projectController = require('../controllers/project.controller');

const router = express.Router();
router.post('/create', projectController.createProject);
router.get('/getByUserId/:userId', projectController.getByUserId);

module.exports = router;