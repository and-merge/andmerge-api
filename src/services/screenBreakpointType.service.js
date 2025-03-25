const db = require('../models');
const ScreenBreakpointType = db.screenBreakpointTypes;

const getAll = async () => {
    const screenBreakpointTypeDto = await ScreenBreakpointType.findAll({
        attributes: ['id', 'name']
    });

    return screenBreakpointTypeDto;
}

module.exports = {
    getAll
}