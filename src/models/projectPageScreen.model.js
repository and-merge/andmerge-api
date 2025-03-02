
module.exports = (sequelize, Sequelize) => {
    const projectPageScreen = sequelize.define('project_page_screens', {
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        variantName: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        sourceId: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        sourceUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
        version: {
            type: Sequelize.STRING(255),
        },
        imageUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
        },
    });

    return projectPageScreen;
};