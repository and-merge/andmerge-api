module.exports = (sequelize, Sequelize) => {
    const ProjectStatus = sequelize.define('status_types',
        {
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