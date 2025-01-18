const db = require('../models');
const { PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');
const ProjectPageScreen = db.projectPageScreens;

const createProjectPageScreen = async (projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.create(projectPageScreenBody, { transaction: t });
        await t.commit();
        return await getProjectPageScreen(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const updateProjectPageScreen = async (projectPageScreenId, projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.update(projectPageScreenBody, { where: { id: projectPageScreenId } }, { transaction: t });
        await t.commit();
        return await getProjectPageScreen(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const bulkUpdateProjectPageScreens = async (projectPageScreenIds, projectPageScreenBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPageScreen = await ProjectPageScreen.update(projectPageScreenBody, { where: { id: projectPageScreenIds } }, { transaction: t });
        await t.commit();
        return await getProjectPageScreen(projectPageScreen.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const bulkDeleteProjectPageScreens = async (projectPageScreenIds) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPageScreen.destroy({ where: { id: projectPageScreenIds } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getProjectPageScreen = async (id) => {
    const projectPageScreen = await ProjectPageScreen.findByPk(id,
        {
            include: [
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
        status: PROJECT_STATUS_ID_MAPPING[projectPageScreen.statusId],
        figmaFileKey: projectPageScreen.project?.projectSource?.key,
        imageUrl: projectPageScreen.imageUrl,
        createdAt: projectPageScreen.createdAt,
        createdBy: projectPageScreen.createdByUser?.name,
        createdByImageUrl: projectPageScreen.createdByUser?.imageUrl,
        updatedAt: projectPageScreen.updatedAt,
    };

    return await projectPageScreenDto;
}

module.exports = {
    createProjectPageScreen,
    updateProjectPageScreen,
    bulkUpdateProjectPageScreens,
    bulkDeleteProjectPageScreens,
    getProjectPageScreen
}