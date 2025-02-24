module.exports = (sequelize, Sequelize) => {
    const ProjectPageDocumentation = sequelize.define('project_page_documentations', {
        content: {
            type: Sequelize.TEXT,
        },
        version: {
            type: Sequelize.INTEGER,
        },
    });

    return ProjectPageDocumentation;
}