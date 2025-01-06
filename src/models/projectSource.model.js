module.exports = (sequelize, Sequelize) => {
    const ProjectSource = sequelize.define('project_sources', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        key: {
            type: Sequelize.STRING(255),
        },
        url: {
            type: Sequelize.STRING(255),
        },
    }, {
        timestamps: false
    });

    return ProjectSource;
}