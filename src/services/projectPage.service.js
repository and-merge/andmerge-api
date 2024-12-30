const db = require('../models');
const ProjectPage = db.projectPages;

const createProjectPage = async (projectPageBody) => {
    let t = await db.sequelize.transaction();
    try {
        const projectPage = await ProjectPage.create(projectPageBody, { transaction: t });
        await t.commit();
        return await getProjectPage(projectPage.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getProjectPage = async (id) => {
    return await ProjectPage.findByPk(id);
}

module.exports = {
    createProjectPage,
    getProjectPage
}