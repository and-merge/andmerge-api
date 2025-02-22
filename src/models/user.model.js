module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: Sequelize.STRING(255),
            unique: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(255),
            allowNull: false,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        }
    });

    return User;
}