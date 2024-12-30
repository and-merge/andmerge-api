module.exports = (sequelize, Sequelize) => {
    const ProjectStatus = sequelize.define('project_statuses', {
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    },
        {
            timestamps: false
        });

    return ProjectStatus;
}