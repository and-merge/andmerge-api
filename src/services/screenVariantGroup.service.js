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
    return await ScreenVariantGroup.findByPk(id);
}

module.exports = {
    create,
    getSingle
}