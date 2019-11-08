const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const Logger = require('@logger')('getUserSelection.bv.js');
const SelectionCache = require('@api/caches/selections.cache');
const profileLoader = require('@api/loaders/profile');
const {UnauthorizedError} = require('@api/errors');

const checkUserIsAllowedForSelectionBehavior = require('./checkUserIsAllowedForSelection.bv');

const self = {
    /**
     *
     * @return {Promise<void>}
     * @param user
     * @param userSession
     */
    get: async (user, userSession) => {
        if (!checkUserIsAllowedForSelectionBehavior.isAllowed(user, userSession)) {
            throw new UnauthorizedError('User did not participate to the session');
        }
        const cachedSelection = await SelectionCache.get(user.id);
        if (cachedSelection) {
            Logger.debug(`Selection for user {${user.id}} returned from cache`);
            return cachedSelection;
        }

        const connections = await ConnectionModel.find({'members': user._id, 'session_id': userSession.session_id});
        let suggestedUserIds = [];
        connections.forEach((connection) => {
            suggestedUserIds.push(...connection.members.filter((member) => member.toString() !== user.id));
        });
        const suggestedUsers = await profileLoader.getList(suggestedUserIds);
        SelectionCache.set(user.id, suggestedUsers);
        Logger.debug(`Selection for user {${user.id}} set in cache`);
        return suggestedUsers;
    },
};

module.exports = self;
