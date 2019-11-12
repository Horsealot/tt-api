const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const UserCache = require('@api/caches/users.cache');
const UserResponse = require('@api/models/responses/user.response');
const Logger = require('@logger')('profile.js');

const self = {
    get: async (userId) => {
        const cachedUser = await UserCache.get(userId);
        if (cachedUser) {
            Logger.debug(`Load user {${userId}} from cache`);
            return cachedUser;
        }
        const user = await UserModel.findOne({_id: userId});
        if (!user) {
            throw new Error("User not found");
        }
        const userResponse = new UserResponse(user);
        Logger.debug(`Set user {${userId}} in cache`);
        await UserCache.set(user.id, userResponse);
        return userResponse;
    },
    getList: (userIds) => {
        let users = [];
        return Promise.all(userIds.map((userId) => {
            return new Promise((resolve) => {
                self.get(userId).then((user) => {
                    users.push(user);
                }).catch().finally(() => resolve());
            });
        })).then(() => users);
    }
};

module.exports = self;
