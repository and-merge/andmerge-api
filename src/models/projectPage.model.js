
module.exports = (sequelize, Sequelize) => {
    const projectPage = sequelize.define('project_pages', {
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
    });

    return projectPage;
};