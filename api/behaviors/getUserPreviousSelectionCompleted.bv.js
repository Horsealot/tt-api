const mongoose = require('mongoose');
const SessionModel = mongoose.model('Session');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('getUserPreviousSelectionCompleted.bv.js');

const self = {
    /**
     *
     * @param currentSession
     * @param userId
     * @return {Promise<*>}
     */
    get: async (currentSession, userId) => {
        if (currentSession.isActive()) return true;
        const lastSession = await SessionModel.findSessionForSelection();
        if (lastSession) {
            const lastUserSession = await UserSessionModel.findOne({user_id: userId, session_id: lastSession.id});
            if (lastUserSession) return lastUserSession.favoritePicked;
        }
        return true;
    },
};

module.exports = self;
