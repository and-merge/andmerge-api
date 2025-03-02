const httpStatus = require('http-status');

const { projectService, projectPageService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');
const { ProjectStatusIdEnum } = require('../utils/Enum');

const createProject = catchAsync(async (req, res) => {
    const project = await projectService.create(req.body);
    res.status(httpStatus.status.CREATED).send(project);
});

const createPage = catchAsync(async (req, res) => {
    req.body.projectId = req.params.id;
    req.body.statusId = ProjectStatusIdEnum.UPLOADED;
    const projectPage = await projectPageService.createProjectPage(req.body);
    res.status(httpStatus.status.CREATED).send(projectPage);
});

const getSingle = catchAsync(async (req, res) => {
    const project = await projectService.getSingle(req.params.id);
    res.send(project);
});

const getByUserId = catchAsync(async (req, res) => {
    if (!req.params.userId) throw new ApiError(httpStatus.status.BAD_REQUEST, 'No user id');
    const projects = await projectService.getAllByUserId(req.params.userId);
    res.send(projects);
});

module.exports = {
    createProject,
    createPage,
    getSingle,
    getByUserId
}