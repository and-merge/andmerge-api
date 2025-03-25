const { screenBreakpointTypeService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getAllScreenBreakpointTypes = catchAsync(async (req, res) => {
    const screenBreakpointTypes = await screenBreakpointTypeService.getAll();
    res.send(screenBreakpointTypes);
});

module.exports = {
    getAllScreenBreakpointTypes,
}