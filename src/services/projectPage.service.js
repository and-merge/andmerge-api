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
    try {
        projectPage = await ProjectPage.update(projectPageBody, { where: { id: projectPageId } }, { transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        console.error(error);
    }

    return await getSingle(projectPageId);
}

const updateDocumentation = async (projectPageId, documentation) => {
    let t = await db.sequelize.transaction();
    try {
        await ProjectPage.update({
            documentation: documentation
        }, { where: { id: projectPageId } }, { transaction: t });
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
                include: [
                    {
                        model: db.screenVariantGroups,
                        as: 'screenVariantGroup',
                        include: [
                            {
                                model: db.projectPageScreens,
                                as: 'projectPageScreens',
                                attributes: []
                            }
                        ],
                    }
                ],
                order: [['id', 'ASC']]
            },
            {
                model: db.users,
                as: 'createdByUser',
            }
        ]
    });

    const groupedScreens = Object.entries(
        (projectPage.projectPageScreens ?? []).reduce((acc, screen) => {
            const groupId = screen.screenVariantGroupId ?? 'null'; // Handle null/undefined cases
            if (!acc[groupId]) {
                acc[groupId] = [];
            }
            acc[groupId].push({
                id: screen.id,
                name: screen.name,
                imageUrl: screen.imageUrl,
                screenVariantGroupId: screen.screenVariantGroupId,
                variantCount: screen.screenVariantGroup?.dataValues?.screenVariants?.length ?? 0,
                variantName: screen.variantName,
                status: PROJECT_STATUS_ID_MAPPING[screen.statusId],
                updatedAt: screen.updatedAt
            });

            return acc;
        }, {})
    ).map(([groupId, screens]) => ({
        screenVariantGroupId: groupId === 'null' ? null : Number(groupId),
        screens
    })).filter(group => Array.isArray(group.screens) && group.screens.length > 0);

    const projectPageDto = {
        id: projectPage.id,
        name: projectPage.name,
        documentation: projectPage.documentation,
        status: PROJECT_STATUS_ID_MAPPING[projectPage.statusId],
        createdAt: projectPage.createdAt,
        createdBy: projectPage.createdByUser?.name,
        createdByImageUrl: projectPage.createdByUser?.imageUrl,
        screenGroups: groupedScreens
    }

    return projectPageDto;
}

module.exports = {
    create,
    update,
    updateDocumentation,
    getSingle
}