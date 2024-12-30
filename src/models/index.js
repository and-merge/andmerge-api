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
db.projects = require('./project.model.js')(sequelize, Sequelize);
db.projectPages = require('./projectPage.model.js')(sequelize, Sequelize);
db.projectPageScreens = require('./projectPageScreen.model.js')(sequelize, Sequelize);
db.projectStatus = require('./projectStatus.model.js')(sequelize, Sequelize);

// ********** Users **********

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

db.projects.belongsTo(db.projectStatus, {
    foreignKey: {
        name: 'projectStatusId',
    },
    as: 'projectStatus'
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

// ********** Project Pages **********

db.projectPages.belongsTo(db.projects, {
    foreignKey: {
        name: 'projectId',
        type: 'UUID'
    },
    as: 'project'
});

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

db.projectPages.hasMany(db.projectPageScreens, {
    foreignKey: {
        name: 'projectPageId',
        type: 'UUID'
    },
    as: 'projectPageScreens'
});

// ********** Project Page Screens **********

db.projectPageScreens.belongsTo(db.projectPages, {
    foreignKey: {
        name: 'projectPageId',
        type: 'UUID'
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

// ********** Project Status **********

db.projectStatus.hasMany(db.projectPages, {
    foreignKey: {
        name: 'projectStatusId',
    },
    as: 'projects'
});

module.exports = db;
