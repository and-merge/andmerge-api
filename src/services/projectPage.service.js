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
    let projectPage = null;
    try {
        projectPage = await ProjectPage.update(projectPageBody, { where: { id: projectPageId } }, { transaction: t });
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
            },
            {
                model: db.users,
                as: 'createdByUser',
            }
        ]
    });

    const screens = projectPage.projectPageScreens?.map((screen) => (
        {
            id: screen.id,
            name: screen.name,
            status: PROJECT_STATUS_ID_MAPPING[screen.statusId],
            imageUrl: screen.imageUrl,
            updatedAt: screen.updatedAt
        }
    ));

    const projectPageDto = {
        id: projectPage.id,
        name: projectPage.name,
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
    getSingle
}