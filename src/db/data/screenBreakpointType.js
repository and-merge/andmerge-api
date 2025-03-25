const db = require('../../models');
const ScreenBreakpointType = db.screenBreakpointTypes;

module.exports = function () {
    return ScreenBreakpointType.bulkCreate([
        // Returning and thus passing a Promise here
        {
            id: 1,
            name: 'Default',
        },
        {
            id: 2,
            name: 'Mobile',
        },
        {
            id: 3,
            name: 'Tablet',
        },
        {
            id: 4,
            name: 'Large',
        },
    ]);
};
