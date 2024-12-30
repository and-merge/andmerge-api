const db = require('../models');
const User = db.users;

const createUser = async (userBody) => {
    let t = await db.sequelize.transaction();
    try {
        const user = await User.create(userBody, { transaction: t });
        await t.commit();
        return await getUser(user.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getUser = async (id) => {
    return await User.findByPk(id);
}

const getUserByEmail = async (email) => {
    return await User.findOne({
        where: { email }
    });
}

module.exports = {
    createUser,
    getUser,
    getUserByEmail
}