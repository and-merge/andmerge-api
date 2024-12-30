const httpStatus = require('http-status');

const { projectService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');

const createProject = catchAsync(async (req, res) => {
    const project = await projectService.createProject(req.body);
    res.status(httpStatus.status.CREATED).send(project);
});

const getByUserId = catchAsync(async (req, res) => {
    if (!req.params.userId) throw new ApiError(httpStatus.status.BAD_REQUEST, 'No user id');
    const projects = await projectService.getProjectsByUserId(req.params.userId);
    res.send(projects);
});

module.exports = {
    createProject,
    getByUserId
}