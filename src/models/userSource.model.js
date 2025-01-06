module.exports = (sequelize, Sequelize) => {
    const UserSource = sequelize.define('user_sources', {
        sourceId: {
            type: Sequelize.STRING(255),
        },
        imageUrl: {
            type: Sequelize.STRING(255),
        }
    });

    return UserSource;
}