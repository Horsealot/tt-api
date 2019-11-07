const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const Logger = require('@logger')('getUserSelection.bv.js');
const SelectionCache = require('@api/caches/selections.cache');
const profileLoader = require('@api/loaders/profile');

const self = {
    /**
     *
     * @param userId
     * @param sessionId
     * @return {Promise<void>}
     */
    get: async (userId, sessionId) => {
        const cachedSelection = await SelectionCache.get(userId);
        if (cachedSelection) {
            Logger.debug(`Selection for user {${userId}} returned from cache`);
            return cachedSelection;
        }

        const connections = await ConnectionModel.find({'members': userId, 'session_id': sessionId});
        let suggestedUserIds = [];
        connections.forEach((connection) => {
            suggestedUserIds.push(...connection.members.filter((member) => member.toString() !== userId));
        });
        const suggestedUsers = await profileLoader.getList(suggestedUserIds);
        SelectionCache.set(userId, suggestedUsers);
        Logger.debug(`Selection for user {${userId}} set in cache`);
        return suggestedUsers;
    },
};

module.exports = self;
