const db = require('../../models');
const SourceType = db.sourceTypes;

module.exports = function () {
    return SourceType.bulkCreate([
        // Returning and thus passing a Promise here
        {
            id: 1,
            name: 'Figma',
        },
    ]);
};
