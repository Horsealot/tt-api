const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('remover.js');
const addUserToBlacklistBehavior = require('@api/behaviors/addUserToBlacklist.bv');
const blacklistStatus = require('@models/schemas/session/blockedStatus');

const self = {
    /**
     * Refuse the macaroon sent by userIdToRemove to the user (userId) in the current session
     * @param sessionId
     * @param userId
     * @param userIdToRemove
     * @return {Promise<void>}
     */
    refuseForUserId: async (sessionId, userId, userIdToRemove) => {
        let session = await UserSessionModel.findOne({user_id: userId, session_id: sessionId});
        self.refuseForSession(session, userIdToRemove);
    },
    /**
     * Refuse the macaroon sent by userIdToRemove to the current session user
     * @param session
     * @param userIdToRemove
     * @return {Promise<void>}
     */
    refuseForSession: async (session, userIdToRemove) => {
        if (!session || !session.macaroons || !session.macaroons.length) return;

        session.refuseMacaroon(userIdToRemove);
        await session.save();
        await addUserToBlacklistBehavior.addToUserBlacklist(session.user_id, userIdToRemove, blacklistStatus.REFUSED);
        Logger.debug(`{${session.user_id}} refused {${userIdToRemove}} macaroon`);
    },
};

module.exports = self;
