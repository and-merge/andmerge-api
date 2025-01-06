module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define('statuses',
        {
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
        },
        {
            timestamps: false
        });

    return Status;
}