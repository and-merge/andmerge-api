const httpStatus = require('http-status');

const { projectPageService, projectPageScreenService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');

const updatePage = catchAsync(async (req, res) => {
    const updatedPage = await projectPageService.update(req.params.id, req.body);
    res.send(updatedPage);
});

const moveProjectScreens = catchAsync(async (req, res) => {
    const projectPage = await projectPageService.getSingle(req.params.id);
    const projectPageScreenIds = req.body.map((id) => id) ?? [];

    if (projectPageScreenIds.length === 0) throw new ApiError(httpStatus.status.BAD_REQUEST, 'No screens.');

    const projectPageScreenBody = {
        projectPageId: projectPage.id,
        projectId: projectPage.projectId,
    };

    await projectPageScreenService.bulkUpdate(projectPageScreenIds, projectPageScreenBody);

    res.send(true);
});

const updateDocumentation = catchAsync(async (req, res) => {
    const updatedPage = await projectPageService.updateDocumentation(req.params.id, req.body.documentation);
    res.send(updatedPage);
});

module.exports = {
    updatePage,
    moveProjectScreens,
    updateDocumentation
}