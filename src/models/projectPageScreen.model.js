
module.exports = (sequelize, Sequelize) => {
    const projectPageScreen = sequelize.define('project_page_screens', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        figmaNodeId: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        imageUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
    });

    return projectPageScreen;
};