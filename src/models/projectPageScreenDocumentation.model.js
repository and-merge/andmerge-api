module.exports = (sequelize, Sequelize) => {
    const ProjectPageScreenDocumentation = sequelize.define('project_page_screen_documentations', {
        content: {
            type: Sequelize.TEXT,
        },
        version: {
            type: Sequelize.INTEGER,
        },
    });

    return ProjectPageScreenDocumentation;
}