const httpStatus = require('http-status');

const { projectPageScreenService, screenVariantGroupService, projectPageService } = require('../services');
const catchAsync = require("../utils/catchAsync");
const ApiError = require('../utils/ApiError');
const { PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');

const getProjectPageScreen = catchAsync(async (req, res) => {
    const screen = await projectPageScreenService.getSingle(req.params.id);
    res.send(screen);
});

const getProjectPageScreensByProjectPageId = catchAsync(async (req, res) => {
    const projectPage = await projectPageService.getSingle(req.params.projectPageId);
    if (!projectPage) throw new ApiError(httpStatus.status.BAD_REQUEST, 'Project Page not found');
    const screens = projectPage.screenGroups.flatMap((group) => group.screens);
    res.send(screens);
});

const updateProjectPageScreen = catchAsync(async (req, res) => {

    if (req.body.isUnlink) {
        const currentScreen = await projectPageScreenService.getSingle(req.params.id);

        if (currentScreen && currentScreen.screenVariantGroupId) {
            const variantGroup = await screenVariantGroupService.getSingle(currentScreen.screenVariantGroupId);

            if (variantGroup.screens.filter((screen) => screen.id !== currentScreen.id).length === 1) {
                await screenVariantGroupService.destroy(currentScreen.screenVariantGroupId);
            }
        }
    }

    const updatedScreen = await projectPageScreenService.update(req.params.id, req.body);

    res.send(updatedScreen);
});

const deleteProjectPageScreens = catchAsync(async (req, res) => {
    const projectPageScreenIds = req.body.map((id) => id);

    for (const id of projectPageScreenIds) {
        const currentScreen = await projectPageScreenService.getSingle(id);

        if (currentScreen && currentScreen.screenVariantGroupId) {
            const variantGroup = await screenVariantGroupService.getSingle(currentScreen.screenVariantGroupId);

            if (variantGroup.screens.filter((screen) => screen.id !== currentScreen.id).length === 1) {
                await screenVariantGroupService.destroy(currentScreen.screenVariantGroupId);
            };
        };
    };

    await projectPageScreenService.bulkDelete(projectPageScreenIds);

    res.send(true);
});

const combineProjectPageScreens = catchAsync(async (req, res) => {
    try {
        const screens = req.body;
        let screenVariantGroupIds = screens.map((screen) => (screen.screenVariantGroupId)).filter(v => v !== undefined && v !== null && v !== "");
        const uniqueIds = new Set(screenVariantGroupIds);
        const isUnique = uniqueIds.size > 1;
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
            };

            const updatedScreen = await projectPageScreenService.update(screen.id, variantBody);
        };

        res.send(screenVariantGroup);
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.status.BAD_REQUEST, '');
    }
});

const assignProjectPageScreens = catchAsync(async (req, res) => {
    let screens = req.body;
    if (!screens || screens.length === 0) throw new ApiError(500, 'No screens!');
    screens = screens.sort((a, b) => Number(a.screenBreakpointTypeId) - Number(b.screenBreakpointTypeId));
    const defaultBreakpoint = screens[0];

    for (const screen of screens) {
        let screenDto = {
            defaultBreakpointId: null,
            screenBreakpointTypeId: screen.screenBreakpointTypeId,
        };

        if (screen.id !== defaultBreakpoint.id) {
            screenDto.defaultBreakpointId = defaultBreakpoint.id;
        }
        const updatedScreen = await projectPageScreenService.update(screen.id, screenDto);
    }

    res.send(screens);
});

module.exports = {
    getProjectPageScreen,
    getProjectPageScreensByProjectPageId,
    updateProjectPageScreen,
    deleteProjectPageScreens,
    combineProjectPageScreens,
    assignProjectPageScreens
}