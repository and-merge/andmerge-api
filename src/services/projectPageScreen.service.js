const db = require('../models');
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
    return await ProjectPageScreen.findByPk(id);
}

module.exports = {
    createProjectPageScreen,
    updateProjectPageScreen,
    bulkUpdateProjectPageScreens,
    bulkDeleteProjectPageScreens,
    getProjectPageScreen
}