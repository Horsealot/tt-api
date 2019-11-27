const profileLoader = require('./profile');
const caster = require('@api/utils/caster');

const self = {
    load: async (connection, loggedInUserId) => {
        if (connection.toObject) connection = connection.toObject();
        connection.members = await profileLoader.getList(connection.members.filter((userId) => caster.toString(userId) !== caster.toString(loggedInUserId)));
        return connection;
    },
};

module.exports = self;
