const db = require('../../models');
const Status = db.statuses;

module.exports = function () {
    return Status.bulkCreate([
        // Returning and thus passing a Promise here
        {
            id: 1,
            name: 'Uploading',
            statusTypeId: 1,
        },
        {
            id: 2,
            name: 'Uploaded',
            statusTypeId: 1,
        },
        {
            id: 3,
            name: 'In development',
            statusTypeId: 1,
        },
        {
            id: 4,
            name: 'Ready for development',
            statusTypeId: 1,
        },
        {
            id: 5,
            name: 'Development updated',
            statusTypeId: 1,
        },
        {
            id: 6,
            name: 'Finished',
            statusTypeId: 1,
        },
        {
            id: 7,
            name: 'Ready for QA',
            statusTypeId: 1,
        },
        {
            id: 8,
            name: 'Design updated',
            statusTypeId: 1,
        },
        {
            id: 9,
            name: 'Finished incrementally',
            statusTypeId: 1,
        },
        {
            id: 10,
            name: 'Change requested',
            statusTypeId: 1,
        },
    ]);
};
