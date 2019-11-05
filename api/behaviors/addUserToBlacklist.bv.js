const mongoose = require('mongoose');
const UserBlacklistModel = mongoose.model('Blacklist');
const Logger = require('@logger')('remover.js');

const self = {
    addToUserBlacklist: async (loggedUserId, userIdToAdd, status) => {
        let userBlacklist = await UserBlacklistModel.findOne({user_id: loggedUserId});
        if (!userBlacklist) userBlacklist = new UserBlacklistModel({
            user_id: loggedUserId
        });
        userBlacklist.addUser(userIdToAdd, status);
        await userBlacklist.save();
        Logger.debug(`{${userIdToAdd}} added to {${loggedUserId}}'s blacklist with status {${status}}`);
    },
};

module.exports = self;
