const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    logging: true,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX),
        min: parseInt(process.env.DB_POOL_MIN),
        acquire: process.env.DB_POOL_ACQUIRE,
        idle: process.env.DB_POOL_IDLE,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./user.model.js')(sequelize, Sequelize);
db.userSources = require('./userSource.model.js')(sequelize, Sequelize);
db.projects = require('./project.model.js')(sequelize, Sequelize);
db.projectSources = require('./projectSource.model.js')(sequelize, Sequelize);
db.projectPages = require('./projectPage.model.js')(sequelize, Sequelize);
db.projectPageDocumentations = require('./projectPageDocumentation.model.js')(sequelize, Sequelize);
db.projectPageScreens = require('./projectPageScreen.model.js')(sequelize, Sequelize);
db.projectPageScreenDocumentations = require('./projectPageScreenDocumentation.model.js')(sequelize, Sequelize);
db.sourceTypes = require('./sourceType.model.js')(sequelize, Sequelize);
db.statuses = require('./status.model.js')(sequelize, Sequelize);
db.statusTypes = require('./statusType.model.js')(sequelize, Sequelize);

// ********** Users **********

db.users.hasMany(db.userSources, {
    foreignKey: {
        name: 'userId',
        type: 'UUID'
    },
    as: 'userSources'
});

db.users.hasMany(db.projects, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'projectsCreated'
});

db.users.hasMany(db.projects, {
    foreignKey: {
        name: 'updatedByUserId',
        type: 'UUID'
    },
    as: 'projectsUpdated'
});

db.users.hasMany(db.projectPages, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'projectPagesCreated'
});

db.users.hasMany(db.projectPages, {
    foreignKey: {
        name: 'updatedByUserId',
        type: 'UUID'
    },
    as: 'projectPagesUpdated'
});

db.users.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'projectPageScreensCreated'
});

db.users.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'updatedByUserId',
        type: 'UUID'
    },
    as: 'projectPageScreensUpdated'
});

db.users.hasMany(db.projectPageDocumentations, {
    foreignKey: {
        name: 'userId',
        type: 'UUID'
    },
    as: 'projectPageDocumentations'
});

db.users.hasMany(db.projectPageScreenDocumentations, {
    foreignKey: {
        name: 'userId',
        type: 'UUID'
    },
    as: 'projectPageScreenDocumentations'
});

// ********** User Sources **********

db.userSources.belongsTo(db.users, {
    foreignKey: {
        name: 'userId',
        type: 'UUID'
    },
    as: 'user'
});

db.userSources.belongsTo(db.sourceTypes, {
    foreignKey: {
        name: 'sourceTypeId',
    },
    as: 'sourceType'
});

// ********** Projects **********

db.projects.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'createdByUser'
});

db.projects.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'updatedByUser'
});

db.projects.belongsTo(db.projectSources, {
    foreignKey: {
        name: 'projectSourceId',
    },
    as: 'projectSource'
});

db.projects.belongsTo(db.statuses, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'status'
});

db.projects.hasMany(db.projectPages, {
    foreignKey: {
        name: 'projectId',
        type: 'UUID'
    },
    as: 'projectPages'
});

db.projects.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'projectId',
        type: 'UUID'
    },
    as: 'projectPageScreens'
});


// ********** Project Sources **********

db.projectSources.hasMany(db.projects, {
    foreignKey: {
        name: 'projectSourceId',
    },
    as: 'projects'
});

db.projectSources.belongsTo(db.sourceTypes, {
    foreignKey: {
        name: 'sourceTypeId'
    },
    as: 'sourceType'
});

// ********** Project Pages **********

db.projectPages.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'createdByUser'
});

db.projectPages.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'updatedByUser'
});

db.projectPages.belongsTo(db.projects, {
    foreignKey: {
        name: 'projectId',
        type: 'UUID'
    },
    as: 'project'
});

db.projectPages.belongsTo(db.statuses, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'status'
});

db.projectPages.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'projectPageId',
    },
    as: 'projectPageScreens'
});

db.projectPages.hasMany(db.projectPageDocumentations, {
    foreignKey: {
        name: 'projectPageId',
    },
    as: 'projectPageDocumentations'
});

// ********** Project Page Documentations **********

db.projectPageDocumentations.belongsTo(db.projectPages, {
    foreignKey: {
        name: 'projectPageId',
    },
    as: 'projectPage'
});

db.projectPageDocumentations.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
    },
    as: 'createdByUser'
});

db.projectPageDocumentations.belongsTo(db.users, {
    foreignKey: {
        name: 'updatedByUserId',
    },
    as: 'updatedByUser'
});

// ********** Project Page Screens **********


db.projectPageScreens.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'createdByUser'
});

db.projectPageScreens.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
        type: 'UUID'
    },
    as: 'updatedByUser'
});

db.projectPageScreens.belongsTo(db.projectPages, {
    foreignKey: {
        name: 'projectPageId',
    },
    as: 'projectPage'
});

db.projectPageScreens.belongsTo(db.projects, {
    foreignKey: {
        name: 'projectId',
        type: 'UUID'
    },
    as: 'project'
});

db.projectPageScreens.belongsTo(db.statuses, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'status'
});

// ********** Project Page Documentations **********

db.projectPageScreenDocumentations.belongsTo(db.projectPages, {
    foreignKey: {
        name: 'projectPageScreenId',
    },
    as: 'projectPageScreen'
});

db.projectPageScreenDocumentations.belongsTo(db.users, {
    foreignKey: {
        name: 'createdByUserId',
    },
    as: 'createdByUser'
});

db.projectPageScreenDocumentations.belongsTo(db.users, {
    foreignKey: {
        name: 'updatedByUserId',
    },
    as: 'updatedByUser'
});

// ********** Status Types **********

db.statusTypes.hasMany(db.statuses, {
    foreignKey: {
        name: 'statusTypeId',
    },
    as: 'statuses'
});

// ********** Status **********

db.statuses.hasMany(db.projects, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'projects'
});

db.statuses.hasMany(db.projectPages, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'projectPages'
});

db.statuses.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'statusId',
    },
    as: 'projectPageScreens'
});

db.statuses.belongsTo(db.statusTypes, {
    foreignKey: {
        name: 'statusTypeId',
    },
    as: 'statusType'
});

// ********** Source Types **********

db.sourceTypes.hasMany(db.userSources, {
    foreignKey: {
        name: 'sourceTypeId'
    },
    as: 'userSources'
});

db.sourceTypes.hasMany(db.projectSources, {
    foreignKey: {
        name: 'sourceTypeId'
    },
    as: 'projectSources'
});

module.exports = db;
