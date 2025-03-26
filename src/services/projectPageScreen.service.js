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

    const projectPageScreenDto = {
        id: projectPageScreen.id,
        name: projectPageScreen.name,
        sourceId: projectPageScreen.sourceId,
        sourceUrl: projectPageScreen.sourceUrl,
        imageUrl: projectPageScreen.imageUrl,
        projectPageId: projectPageScreen.projectPageId,
        screenVariantGroupId: projectPageScreen.screenVariantGroupId,
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
        breakpoints: projectPageScreen.breakpoints?.map((breakpoint) => (
            {
                id: breakpoint?.dataValues?.id,
                name: breakpoint?.dataValues?.name,
                defaultBreakpointId: breakpoint?.dataValues?.defaultBreakpointId,
                screenBreakpointTypeId: breakpoint?.dataValues?.screenBreakpointTyp,
            }
        )) ?? []
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