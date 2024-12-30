const db = require('../../models');
const ProjectStatus = db.projectStatus;

module.exports = function () {
    return ProjectStatus.bulkCreate([
        // Returning and thus passing a Promise here
        {
            id: 1,
            name: 'Uploaded',
        },
        {
            id: 2,
            name: 'In development',
        },
        {
            id: 3,
            name: 'Ready for development',
        },
        {
            id: 4,
            name: 'Development updated',
        },
        {
            id: 5,
            name: 'Finished',
        },
        {
            id: 6,
            name: 'Ready for QA',
        },
        {
            id: 7,
            name: 'Design updated',
        },
    ]);
};
