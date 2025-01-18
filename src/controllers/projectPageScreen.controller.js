const { projectPageScreenService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');

const getSingle = catchAsync(async (req, res) => {
    const screen = await projectPageScreenService.getProjectPageScreen(req.params.id);
    res.send(screen);
});

const deleteProjectPageScreens = catchAsync(async (req, res) => {
    const projectPageScreenIds = req.body.map((id) => id);
    await projectPageScreenService.bulkDeleteProjectPageScreens(projectPageScreenIds);
    res.send(true);
});

module.exports = {
    getSingle,
    deleteProjectPageScreens,
}