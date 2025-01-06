module.exports = (sequelize, Sequelize) => {
    const Project = sequelize.define('projects', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        figmaFileKey: {
            type: Sequelize.STRING(22),
            allowNull: false,
        },
        figmaUrl: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    });

    return Project;
}