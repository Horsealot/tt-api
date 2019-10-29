const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('Session');
const UserBlacklistModel = mongoose.model('Blacklist');

const self = {
    getUserBlacklist: async (userId) => {
        const userBlockedBlacklist = await UserBlacklistModel.findOne({user_id: userId});
        if (userBlockedBlacklist) {
            return userBlockedBlacklist.data.map((blockedUser) => blockedUser.user_id);
        }
        return [];
    },
    getUserWhoBlacklisted: async (userId) => {
        const userWhoBlockedBlacklist = await UserBlacklistModel.find({'data.user_id': userId});
        return userWhoBlockedBlacklist.map((userBlacklist) => userBlacklist.user_id);
    },
    getUserAlreadyLinked: async (userId) => {
        // We blacklist user who already sent a macaroon (Should we filter by status ?)
        return (await UserSessionModel.find({'macaroons.user_id': userId}, 'user_id')).map((macaroon) => macaroon.user_id);
    }
};

module.exports = self;
