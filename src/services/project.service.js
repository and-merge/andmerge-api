const db = require('../models');
const Project = db.projects;
const ProjectPages = db.projectPages;
const ProjectPageScreens = db.projectPageScreens;
const { ProjectStatusIdEnum } = require('../utils/Enum');

const createProject = async (projectBody) => {
    let t = await db.sequelize.transaction();
    try {
        projectBody.projectStatusId = ProjectStatusIdEnum.UPLOADED;
        const project = await Project.create(projectBody, { transaction: t });
        for (let projectPageBody of projectBody.pages) {
            projectPageBody.projectId = project.dataValues.id;
            const projectPage = await ProjectPages.create(projectPageBody, { transaction: t });
            for (let projectPageScreenBody of projectPageBody.screens) {
                projectPageScreenBody.projectPageId = projectPage.id;
                projectPageScreenBody.projectId = project.dataValues.id;
                const projectPageScreen = await ProjectPageScreens.create(projectPageScreenBody, { transaction: t });
            }
        }

        await t.commit();
        return await getProject(project.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getProject = async (id) => {
    return await Project.findByPk(id);
}

const getProjectsByUserId = async (userId) => {

    const projects = await Project.findAll({
        where: {
            createdByUserId: userId
        },
        include: [
            {
                model: db.projectPages,
                as: 'projectPages',
                include: [
                    {
                        model: db.projectPageScreens,
                        as: 'projectPageScreens',
                    }
                ]
            },
        ],
        order: [['createdAt', 'DESC']]
    });


    const projectData = projects.map((project) => {
        const screens = project.projectPages?.flatMap((page) => {
            return page.projectPageScreens.map((screen) => {
                return {
                    id: screen.id,
                    name: screen.name,
                    figmaNodeId: screen.figmaNodeId,
                    imageUrl: screen.imageUrl
                }
            });
        });

        return {
            id: project.id,
            name: project.name,
            updatedAt: project.updatedAt,
            projectStatusId: project.projectStatusId,
            screens: screens
        }
    });

    return projectData;
}

module.exports = {
    createProject,
    getProject,
    getProjectsByUserId
}