const db = require('../models');
const { PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');
const ProjectPageScreen = db.projectPageScreens;

const create = async (projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.create(projectPageScreenBody, { transaction: t });
        await t.commit();
        return await getSingle(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const update = async (id, projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPageScreen.update(projectPageScreenBody, { where: { id: id } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }

    return await getSingle(id);
}

const bulkUpdate = async (projectPageScreenIds, projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.update(projectPageScreenBody, { where: { id: projectPageScreenIds } }, { transaction: t });
        await t.commit();
        return await getSingle(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const bulkDelete = async (projectPageScreenIds) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPageScreen.destroy({ where: { id: projectPageScreenIds } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getSingle = async (id) => {
    const projectPageScreen = await ProjectPageScreen.findByPk(id,
        {
            include: [
                {
                    model: db.projectPageScreens,
                    as: 'breakpoints',
                    order: [['screenBreakpointTypeId', 'ASC']]
                },
                {
                    model: db.screenVariantGroups,
                    as: 'screenVariantGroup',
                    include: [
                        {
                            model: db.projectPageScreens,
                            as: 'projectPageScreens',
                            order: [['createdAt', 'ASC']]
                        }
                    ]
                },
                {
                    model: db.users,
                    as: 'createdByUser',
                },
                {
                    model: db.projects,
                    as: 'project',
                    include: [
                        {
                            model: db.projectSources,
                            as: 'projectSource'
                        }
                    ]
                }
            ]
        });

    let breakpoints = projectPageScreen.breakpoints?.map((breakpoint) => (
        {
            id: breakpoint?.id,
            name: breakpoint?.name,
            defaultBreakpointId: breakpoint.defaultBreakpointId,
            screenBreakpointTypeId: breakpoint.screenBreakpointTypeId,
        }
    )) ?? [];

    if (projectPageScreen.defaultBreakpointId) {
        const defaultBreakpoint = await ProjectPageScreen.findByPk(projectPageScreen.defaultBreakpointId, {
            include: [
                {
                    model: db.projectPageScreens,
                    as: 'breakpoints',
                    order: [['screenBreakpointTypeId', 'ASC']]
                },
            ]
        });

        if (defaultBreakpoint) {
            breakpoints = [
                {
                    id: defaultBreakpoint.id,
                    name: defaultBreakpoint.name,
                    defaultBreakpointId: defaultBreakpoint.defaultBreakpointId,
                    screenBreakpointTypeId: defaultBreakpoint.screenBreakpointTypeId,
                },
                ...defaultBreakpoint.breakpoints?.map((breakpoint) => (
                    {
                        id: breakpoint.id,
                        name: breakpoint.name,
                        defaultBreakpointId: breakpoint.defaultBreakpointId,
                        screenBreakpointTypeId: breakpoint.screenBreakpointTypeId,
                    }
                ))
            ] ?? [];
        };
    }


    const projectPageScreenDto = {
        id: projectPageScreen.id,
        name: projectPageScreen.name,
        sourceId: projectPageScreen.sourceId,
        sourceUrl: projectPageScreen.sourceUrl,
        imageUrl: projectPageScreen.imageUrl,
        projectPageId: projectPageScreen.projectPageId,
        screenVariantGroupId: projectPageScreen.screenVariantGroupId,
        defaultBreakpointId: projectPageScreen.defaultBreakpointId,
        screenBreakpointTypeId: projectPageScreen.screenBreakpointTypeId,
        variantCount: projectPageScreen.screenVariantGroup?.dataValues?.projectPageS ?? 0,
        variantName: projectPageScreen.variantName,
        variants: projectPageScreen.screenVariantGroup?.projectPageScreens?.map((variant) => {
            return {
                id: variant.dataValues?.id,
                variantName: variant.dataValues?.variantName,
            }
        }),
        documentation: projectPageScreen.documentation,
        status: PROJECT_STATUS_ID_MAPPING[projectPageScreen.statusId],
        figmaFileKey: projectPageScreen.project?.projectSource?.key,
        createdAt: projectPageScreen.createdAt,
        createdBy: projectPageScreen.createdByUser?.name,
        createdByImageUrl: projectPageScreen.createdByUser?.imageUrl,
        updatedAt: projectPageScreen.updatedAt,
        breakpoints: breakpoints
    };

    return projectPageScreenDto;
}

const destroy = async (id) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPageScreen.destroy({
            where: { id: id }
        });
        await t.commit();

    } catch (error) {
        await t.rollback();
        console.log(error);
    }
}

module.exports = {
    create,
    update,
    bulkUpdate,
    bulkDelete,
    getSingle,
    destroy
}