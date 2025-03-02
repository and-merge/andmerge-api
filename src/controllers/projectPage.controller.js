const httpStatus = require('http-status');

const { projectPageService, projectPageScreenService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');

const moveProjectScreens = catchAsync(async (req, res) => {
    const projectPage = await projectPageService.getProjectPage(req.params.id);
    const projectPageScreenIds = req.body.map((id) => id);

    const projectPageScreenBody = {
        projectPageId: projectPage.id,
        projectId: projectPage.projectId,
    };

    await projectPageScreenService.bulkUpdate(projectPageScreenIds, projectPageScreenBody);

    res.send(true);
});

module.exports = {
    moveProjectScreens,
}