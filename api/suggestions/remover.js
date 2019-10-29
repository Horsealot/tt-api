const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const SessionsCache = require('@api/caches/sessions.cache');
const Logger = require('@logger')('remover.js');


const self = {
    /**
     * Remove userIdToRemove from user (userId)'s suggestions for current session
     * @param userId
     * @param userIdToRemove
     * @return {Promise<void>}
     */
    removeFromUserSuggestions: async (userId, userIdToRemove) => {
        let session = await UserSessionModel.findOne({user_id: userId});
        self.removeFromSession(session, userIdToRemove);
    },
    /**
     * Remove userIdToRemove from the passed session's suggestions
     * @param session
     * @param userIdToRemove
     * @return {Promise<void>}
     */
    removeFromSession: async (session, userIdToRemove) => {
        if (!session || !session.suggestions || !session.suggestions.data || !session.suggestions.data.length) return;

        session.rmSuggestion(userIdToRemove);
        await session.save();
        await SessionsCache.set(session.user_id, session.getSuggestions());
        Logger.debug(`{${session.user_id}}'s suggestions cleaned from user {${userIdToRemove}}`);
    },
};

module.exports = self;
