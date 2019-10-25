const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const UserCache = require('@api/caches/users.cache');
const UserResponse = require('@api/models/responses/user.response');
const Logger = require('@logger');

const self = {
    get: async (userId) => {
        const cachedUser = await UserCache.get(userId);
        if (cachedUser) {
            Logger.debug(`profile.js\tLoad user {${userId}} from cache`);
            return cachedUser;
        }
        const user = await UserModel.findOne({_id: userId});
        if (!user) {
            throw new Error("User not found");
        }
        const userResponse = new UserResponse(user);
        Logger.debug(`profile.js\tSet user {${userId}} in cache`);
        await UserCache.set(user.id, userResponse);
        return userResponse;
    },
};

module.exports = self;
