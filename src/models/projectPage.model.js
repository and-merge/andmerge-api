
module.exports = (sequelize, Sequelize) => {
    const projectPage = sequelize.define('project_pages', {
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        documentation: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    });

    return projectPage;
};