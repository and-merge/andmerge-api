
module.exports = (sequelize, Sequelize) => {
    const projectPage = sequelize.define('project_pages', {
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
    });

    return projectPage;
};