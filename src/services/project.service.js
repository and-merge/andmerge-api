const db = require('../models');
const { boss } = require('../pgboss');
const Project = db.projects;
const ProjectPages = db.projectPages;
const ProjectPageScreens = db.projectPageScreens;
const ProjectSources = db.projectSources;
const { ProjectStatusIdEnum, SourceTypeIdEnum, PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');

const createProject = async (projectBody) => {
    let t = await db.sequelize.transaction();
    try {
        // Create Project Source
        const projectSourceBody = {
            key: projectBody.sourceKey,
            url: projectBody.sourceUrl,
            sourceTypeId: SourceTypeIdEnum.FIGMA,
        }

        const projectSource = await ProjectSources.create(projectSourceBody, { transaction: t });

        // Create Project
        projectBody.projectSourceId = projectSource.id;
        projectBody.statusId = ProjectStatusIdEnum.UPLOADING;
        const project = await Project.create(projectBody, { transaction: t });

        // Create Project Page
        const projectPageBody = {
            name: 'Page 1',
            statusId: ProjectStatusIdEnum.UPLOADING,
            projectId: project.dataValues.id,
            createdByUserId: projectBody.createdByUserId,
            updatedByUserId: projectBody.updatedByUserId,
        }

        const projectPage = await ProjectPages.create(projectPageBody, { transaction: t });

        projectBody.screens.forEach((screen) => {
            screen.imageUrl = null;
            screen.projectPageId = projectPage.id;
            screen.projectId = project.dataValues.id;
            screen.statusId = ProjectStatusIdEnum.UPLOADING;
        });

        await ProjectPageScreens.bulkCreate(projectBody.screens, { validate: true, transaction: t });

        await t.commit();
        await boss.createQueue('processImages');
        await boss.send('processImages', { projectId: project.id, token: projectBody.token, sourceKey: projectBody.sourceKey });
        return await getProject(project.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getProject = async (id) => {
    const project = await Project.findByPk(id, {
        include: [
            {
                model: db.projectPages,
                as: 'projectPages',
                include: [
                    {
                        model: db.projectPageScreens,
                        as: 'projectPageScreens',
                    },
                    {
                        model: db.users,
                        as: 'createdByUser',
                    }
                ],
                order: [['createdAt', 'ASC']]
            }
        ]
    });

    const projectDto = {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        pages: project.projectPages.map((page) => {
            const screens = page.projectPageScreens?.map((screen) => (
                {
                    id: screen.id,
                    name: screen.name,
                    status: PROJECT_STATUS_ID_MAPPING[screen.statusId],
                    imageUrl: screen.imageUrl,
                    updatedAt: screen.updatedAt
                }
            ));

            return {
                id: page.id,
                name: page.name,
                status: PROJECT_STATUS_ID_MAPPING[page.statusId],
                createdAt: page.createdAt,
                createdBy: page.createdByUser?.name,
                createdByImageUrl: page.createdByUser?.imageUrl,
                screens: screens
            }
        })
    }

    return projectDto;
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
                        order: [['createdAt', 'ASC']]
                    }
                ],
                order: [['createdAt', 'ASC']]
            },
        ],
        order: [['createdAt', 'DESC']]
    });


    const projectDto = projects.map((project) => {
        let screenCount = 0;
        const pages = project.projectPages?.map((page) => {
            const screens = page.projectPageScreens.map((screen) => {
                return {
                    id: screen.id,
                    name: screen.name,
                    sourceUrl: screen.sourceUrl,
                    imageUrl: screen.imageUrl
                }
            });

            screenCount += screens.length;

            return {
                id: page.id,
                name: page.name,
                createdAt: page.createdAt,
                screens: screens
            }
        });

        return {
            id: project.id,
            name: project.name,
            updatedAt: project.updatedAt,
            status: PROJECT_STATUS_ID_MAPPING[project.statusId],
            pages: pages,
            screenCount: screenCount,
        }
    });

    return projectDto;
}

module.exports = {
    createProject,
    getProject,
    getProjectsByUserId
}