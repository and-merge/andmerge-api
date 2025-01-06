const db = require('../../models');
const StatusType = db.statusTypes;

module.exports = function () {
    return StatusType.bulkCreate([
        // Returning and thus passing a Promise here
        {
            id: 1,
            name: 'Project',
        },
    ]);
};
