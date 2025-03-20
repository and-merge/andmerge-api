const db = require('../models');
const ScreenVariantGroup = db.screenVariantGroups;

const create = async (screenVariantGroupBody) => {
    let t = await db.sequelize.transaction();
    try {
        const screenVariantGroup = await ScreenVariantGroup.create(screenVariantGroupBody, { transaction: t });
        await t.commit();
        return await getSingle(screenVariantGroup.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getSingle = async (id) => {
    const screenVariantGroup = await ScreenVariantGroup.findByPk(id, {
        include: [
            {
                model: db.projectPageScreens,
                as: 'projectPageScreens'
            }
        ]
    });

    const groupDto = {
        id: screenVariantGroup.id,
        screens: screenVariantGroup.projectPageScreens ?? [],
    };

    return groupDto;
}

const destroy = async (id) => {
    let t = await db.sequelize.transaction();
    try {
        await db.screenVariantGroups.destroy({
            where: { id: id }
        });
        await t.commit();
        
    } catch (error) {
        await t.rollback();
        console.log(error);
    }
}

module.exports = {
    create,
    getSingle,
    destroy
}