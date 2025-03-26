const db = require('../models');
const { PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');
const ProjectPage = db.projectPages;

const create = async (projectPageBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPage = await ProjectPage.create(projectPageBody, { transaction: t });
        await t.commit();
        return await getSingle(projectPage.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const update = async (projectPageId, projectPageBody) => {
    let t = await db.sequelize.transaction();
    try {
        projectPage = await ProjectPage.update(projectPageBody, { where: { id: projectPageId } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }

    return await getSingle(projectPageId);
}

const updateDocumentation = async (projectPageId, documentation) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPage.update({
            documentation: documentation
        }, { where: { id: projectPageId } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }

    return await getSingle(projectPageId);
}

const getSingle = async (id) => {
    const projectPage = await ProjectPage.findByPk(id, {
        include: [
            {
                model: db.projectPageScreens,
                as: 'projectPageScreens',
                include: [
                    {
                        model: db.screenVariantGroups,
                        as: 'screenVariantGroup',
                        include: [
                            {
                                model: db.projectPageScreens,
                                as: 'projectPageScreens',
                                attributes: [],
                                order: [['createdAt', 'ASC']]
                            }
                        ],
                    },
                    {
                        model: db.projectPageScreens,
                        as: 'breakpoints',
                        order: [['screenBreakpointTypeId', 'ASC']]
                    }
                ],
                order: [['createdAt', 'ASC']]
            },
            {
                model: db.users,
                as: 'createdByUser',
            }
        ]
    });

    const screens = projectPage.projectPageScreens?.map((screen) => ({
        id: screen.id,
        name: screen.name,
        sourceUrl: screen.sourceUrl,
        imageUrl: screen.imageUrl,
        projectPageId: screen.projectPageId,
        screenVariantGroupId: screen.screenVariantGroupId,
        defaultBreakpointId: screen.defaultBreakpointId,
        screenBreakpointTypeId: screen.screenBreakpointTypeId,
        variantCount: screen.screenVariantGroup?.dataValues?.screenVariants?.length ?? 0,
        variantName: screen.variantName,
        status: PROJECT_STATUS_ID_MAPPING[screen.statusId],
        updatedAt: screen.updatedAt,
        breakpoints: screen.breakpoints?.map((breakpoint) => (
            {
                id: breakpoint?.dataValues?.id,
                name: breakpoint?.dataValues?.name,
                defaultBreakpointId: breakpoint?.dataValues?.defaultBreakpointId,
                screenBreakpointTypeId: breakpoint?.dataValues?.screenBreakpointTyp,
            }
        )) ?? []
    }))

    const projectPageDto = {
        id: projectPage.id,
        name: projectPage.name,
        documentation: projectPage.documentation,
        status: PROJECT_STATUS_ID_MAPPING[projectPage.statusId],
        createdAt: projectPage.createdAt,
        createdBy: projectPage.createdByUser?.name,
        createdByImageUrl: projectPage.createdByUser?.imageUrl,
        screens: screens
    }

    return projectPageDto;
}

module.exports = {
    create,
    update,
    updateDocumentation,
    getSingle
}