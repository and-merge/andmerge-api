const db = require('../models');
const ScreenBreakpointGroup = db.screenBreakpointGroups;

const create = async (screenBreakpointGroupBody) => {
    let t = await db.sequelize.transaction();
    try {
        const screenBreakpointGroup = await ScreenBreakpointGroup.create(screenBreakpointGroupBody, { transaction: t });
        await t.commit();
        return await getSingle(screenBreakpointGroup.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getSingle = async (id) => {
    const screenBreakpointGroup = await ScreenBreakpointGroup.findByPk(id, {
        include: [
            {
                model: db.projectPageScreens,
                as: 'projectPageScreens',
            }
        ]
    });

    const groupDto = {
        id: screenBreakpointGroup.id,
        screens: screenBreakpointGroup.projectPageScreens ?? [],
    };

    return groupDto;
}

const destroy = async (id) => {
    let t = await db.sequelize.transaction();
    try {
        await ScreenBreakpointGroup.destroy({
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