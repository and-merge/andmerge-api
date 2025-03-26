const { fn, col, literal } = require('sequelize');
const db = require('../models');
const { boss } = require('../pgboss');
const Project = db.projects;
const ProjectPages = db.projectPages;
const ProjectPageScreens = db.projectPageScreens;
const ProjectSources = db.projectSources;
const ScreenVariantGroups = db.screenVariantGroups;
const { ProjectStatusIdEnum, SourceTypeIdEnum, PROJECT_STATUS_ID_MAPPING } = require('../utils/Enum');

const create = async (projectBody) => {
    let t = await db.sequelize.transaction();
    let project = null;
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
        projectBody.importing = true;
        projectBody.statusId = ProjectStatusIdEnum.UPLOADED;
        project = await Project.create(projectBody, { transaction: t });

        // Create Project Page
        const projectPageBody = {
            name: 'Page 1',
            statusId: ProjectStatusIdEnum.UPLOADED,
            projectId: project.dataValues.id,
            createdByUserId: projectBody.createdByUserId,
            updatedByUserId: projectBody.updatedByUserId,
        }

        const projectPage = await ProjectPages.create(projectPageBody, { transaction: t });

        projectBody.screens.forEach((screen) => {
            screen.imageUrl = null;
            screen.projectPageId = projectPage.id;
            screen.projectId = project.dataValues.id;
            screen.statusId = ProjectStatusIdEnum.UPLOADED;
        });

        await ProjectPageScreens.bulkCreate(projectBody.screens, { validate: true, transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }

    if (project) {
        await boss.createQueue('processImages');
        await boss.send('processImages', { projectId: project.id, token: projectBody.token, sourceKey: projectBody.sourceKey });
    }

    return await getSingle(project.id);
}

const getSingle = async (id) => {
    try {
        const project = await Project.findByPk(id, {
            include: [
                {
                    model: db.projectPages,
                    as: 'projectPages',
                    include: [
                        {
                            model: db.projectPageScreens,
                            as: 'projectPageScreens',
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
                                            attributes: [],
                                            order: [['createdAt', 'ASC']]
                                        }
                                    ],
                                },
                            ],
                            order: [['createdAt', 'ASC']]
                        },
                        {
                            model: db.users,
                            as: 'createdByUser',
                        }
                    ],
                    order: [['createdAt', 'ASC']]
                }
            ],
        });

        let screenCount = 0;
        let importedScreenCount = 0;

        const pages = project.projectPages.map((page) => {
            screenCount += page.projectPageScreens?.length ?? 0;
            importedScreenCount += page.projectPageScreens?.filter((screen) => screen.imageUrl !== null).length ?? 0;

            const screens = page.projectPageScreens?.map((screen) => ({
                id: screen.id,
                name: screen.name,
                sourceUrl: screen.sourceUrl,
                imageUrl: screen.imageUrl,
                projectPageId: screen.projectPageId,
                screenVariantGroupId: screen.screenVariantGroupId,
                defaultBreakpointId: screen.defaultBreakpointId,
                screenBreakpointTypeId: screen.screenBreakpointTypeId,
                variantCount: screen.screenVariantGroup?.dataValues?.screenVariants?.length ?? 0,
                variantName: screen.variantName,
                status: PROJECT_STATUS_ID_MAPPING[screen.statusId],
                updatedAt: screen.updatedAt,
                breakpoints: screen.breakpoints?.map((breakpoint) => (
                    {
                        id: breakpoint?.dataValues?.id,
                        name: breakpoint?.dataValues?.name,
                        defaultBreakpointId: breakpoint?.dataValues?.defaultBreakpointId,
                        screenBreakpointTypeId: breakpoint?.dataValues?.screenBreakpointTyp,
                    }
                )) ?? []
            }))

            return {
                id: page.id,
                name: page.name,
                documentation: page.documentation,
                status: PROJECT_STATUS_ID_MAPPING[page.statusId],
                createdAt: page.createdAt,
                createdBy: page.createdByUser?.name,
                createdByImageUrl: page.createdByUser?.imageUrl,
                screens: screens,
            }
        })

        const projectDto = {
            id: project.id,
            name: project.name,
            importing: project.importing,
            createdAt: project.createdAt,
            pages: pages,
            screenCount: screenCount,
            importedScreenCount: importedScreenCount,
        }


        return projectDto;
    } catch (error) {
        console.error(error);
    }
}

const getAllByUserId = async (userId) => {
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
        let importedScreenCount = 0;

        const pages = project.projectPages?.map((page) => {
            const screens = page.projectPageScreens.map((screen, index) => {
                const imageUrl = (index <= 3 ? screen.imageUrl : null);

                return {
                    id: screen.id,
                    name: screen.name,
                    sourceUrl: screen.sourceUrl,
                    imageUrl: imageUrl
                }
            });

            screenCount += screens.length;
            importedScreenCount += screens.filter((screen) => screen.imageUrl !== null).length;

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
            importing: project.importing,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            status: PROJECT_STATUS_ID_MAPPING[project.statusId],
            pages: pages,
            screenCount: screenCount,
            importedScreenCount: importedScreenCount,
        }
    });

    return projectDto;
}

module.exports = {
    create,
    getSingle,
    getAllByUserId
}