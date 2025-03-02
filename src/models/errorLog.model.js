module.exports = (sequelize, Sequelize) => {
    const ErrorLog = sequelize.define('error_logs', {
        type: {
            type: Sequelize.STRING(100),
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    });

    return ErrorLog;
}