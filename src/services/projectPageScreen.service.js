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

const update = async (projectPageScreenId, projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.update(projectPageScreenBody, { where: { id: projectPageScreenId } }, { transaction: t });
        await t.commit();
        return await getSingle(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const updateVariant = async (projectPageScreenId, variantName, screenVariantGroupId) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPageScreen.update({
            variantName: variantName,
            screenVariantGroupId: screenVariantGroupId,
        }, { where: { id: projectPageScreenId } }, { transaction: t });
        await t.commit();
        return await getSingle(projectPageScreenId);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
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
                    model: db.screenVariantGroups,
                    as: 'screenVariantGroup',
                    include: [
                        {
                            model: db.projectPageScreens,
                            as: 'projectPageScreens',
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
        imageUrl: projectPageScreen.imageUrl,
        screenVariantGroupId: projectPageScreen.screenVariantGroupId,
        variantCount: projectPageScreen.screenVariantGroup?.dataValues?.projectPageS ?? 0,
        variantName: projectPageScreen.variantName,
        status: PROJECT_STATUS_ID_MAPPING[projectPageScreen.statusId],
        figmaFileKey: projectPageScreen.project?.projectSource?.key,
        createdAt: projectPageScreen.createdAt,
        createdBy: projectPageScreen.createdByUser?.name,
        createdByImageUrl: projectPageScreen.createdByUser?.imageUrl,
        updatedAt: projectPageScreen.updatedAt,
    };

    return projectPageScreenDto;
}

module.exports = {
    create,
    update,
    updateVariant,
    bulkUpdate,
    bulkDelete,
    getSingle
}