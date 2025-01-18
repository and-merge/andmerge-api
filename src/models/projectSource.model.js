module.exports = (sequelize, Sequelize) => {
    const ProjectSource = sequelize.define('project_sources', {
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