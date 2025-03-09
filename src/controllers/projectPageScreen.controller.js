const httpStatus = require('http-status');

const { projectPageScreenService, screenVariantGroupService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');
const { PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');

const getSingle = catchAsync(async (req, res) => {
    const screen = await projectPageScreenService.getSingle(req.params.id);
    res.send(screen);
});

const updateProjectPageScreen = catchAsync(async (req, res) => {
    const updatedScreen = await projectPageScreenService.update(req.params.id, req.body);
    res.send(updatedScreen);
});

const deleteProjectPageScreens = catchAsync(async (req, res) => {
    const projectPageScreenIds = req.body.map((id) => id);
    await projectPageScreenService.bulkDelete(projectPageScreenIds);
    res.send(true);
});

const combineProjectPageScreens = catchAsync(async (req, res) => {
    const screens = req.body;
    let screenDto = [];
    let screenVariantGroupIds = screens.map((screen) => (screen.screenVariantGroupId)).filter(Boolean);
    const isUnique = screenVariantGroupIds.length === new Set(screenVariantGroupIds).size;
    if (screenVariantGroupIds.length > 0 && isUnique) throw new ApiError(httpStatus.status.BAD_REQUEST, 'These screens cannot be combined because they are already variants of other screens.');

    let screenVariantGroup = null;

    if (screenVariantGroupIds.length === 0) {
        screenVariantGroup = await screenVariantGroupService.create();
    } else {
        screenVariantGroup = await screenVariantGroupService.getSingle(screenVariantGroupIds[0]);
    };


    for (const screen of screens) {
        const variantBody = {
            variantName: screen.variantName, 
            screenVariantGroupId: screenVariantGroup.id
        }

        const updatedScreen = await projectPageScreenService.update(screen.id, variantBody);
        screenDto.push(updatedScreen);
    }

    res.send(screenDto);
});

module.exports = {
    getSingle,
    updateProjectPageScreen,
    deleteProjectPageScreens,
    combineProjectPageScreens,
}