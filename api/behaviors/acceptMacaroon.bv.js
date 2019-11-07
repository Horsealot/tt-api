const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('acceptMacaroon.bv.js');
const createConnectionBehavior = require('@api/behaviors/createConnection.bv');
const macaroonStatus = require('@models/schemas/session/macaroonStatus');

const self = {
    /**
     * Accept the macaroon sent by userIdToAccept to the user (userId) in the current session
     * @param sessionId
     * @param userId
     * @param userIdToAccept
     * @return {Promise<void>}
     */
    acceptForUserId: async (sessionId, userId, userIdToAccept) => {
        let session = await UserSessionModel.findOne({user_id: userId, session_id: sessionId});
        self.acceptForSession(session, userIdToAccept);
    },
    /**
     * Accept the macaroon sent by userIdToAccept to the current session user
     * @param session
     * @param userIdToAccept
     * @return {Promise<void>}
     */
    acceptForSession: async (session, userIdToAccept) => {
        if (!session || !session.macaroons || !session.macaroons.length) return;

        session.updateMacaroonStatus(userIdToAccept, macaroonStatus.ACCEPTED);
        const correspondingMacaroons = session.macaroons.filter((macaroon) => macaroon.user_id === userIdToAccept);
        const dateOfInvite = correspondingMacaroons.length ? correspondingMacaroons[0].sent_at : new Date();

        await session.save();
        await createConnectionBehavior.create(session.id, userIdToAccept, session.user_id, dateOfInvite);
        Logger.debug(`{${session.user_id}} accepted {${userIdToAccept}}'s macaroon`);
    },
};

module.exports = self;
