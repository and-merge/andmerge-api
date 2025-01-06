module.exports = (sequelize, Sequelize) => {
    const SourceType = sequelize.define('source_types', {
        name: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return SourceType;
}