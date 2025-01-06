const db = require('../models');
const { SourceTypeIdEnum } = require('../utils/Enum');
const User = db.users;
const UserSource = db.userSources;

const createUser = async (userBody) => {
    let t = await db.sequelize.transaction();
    try {
        // Create User
        const user = await User.create(userBody, { transaction: t });

        // Create User Source
        const userSourceBody = {
            sourceId: userBody.sourceId,
            imageUrl: userBody.imageUrl,
            userId: user.id,
            sourceTypeId: SourceTypeIdEnum.FIGMA
        };

        await UserSource.create(userSourceBody, { transaction: t });

        await t.commit();
        return await getUser(user.id);
    } catch (error) {
        await t.rollback();
        console.error(error);
    }
}

const getUser = async (id) => {
    const user = await User.findByPk(id, {
        include: {
            model: db.userSources,
            as: 'userSources'
        }
    });

    const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        sourceId: user.userSources[0]?.sourceId,
        imageUrl: user.userSources[0]?.imageUrl,
    };

    return userData;
}

const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: { email },
        include: {
            model: db.userSources,
            as: 'userSources'
        }
    });

    if (!user) return null;

    const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        sourceId: user.userSources[0]?.dataValues?.sourceId,
        imageUrl: user.userSources[0]?.dataValues?.imageUrl,
    };

    return userData;
}

module.exports = {
    createUser,
    getUser,
    getUserByEmail
}