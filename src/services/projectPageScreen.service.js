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

const getProjectPageScreen = async (id) => {
    return await ProjectPageScreen.findByPk(id);
}

module.exports = {
    createProjectPageScreen,
    getProjectPageScreen
}