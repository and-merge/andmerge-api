module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define('logs', {
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    });

    return Log;
}