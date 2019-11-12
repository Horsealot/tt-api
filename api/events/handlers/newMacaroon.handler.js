const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('newMacaroon.handler.js');
const suggestionsRemover = require('@api/suggestions/remover');
const gamingTypes = require('@models/types/gaming');
const updateUserAndSessionGamingCountBehavior = require('@api/behaviors/updateUserAndSessionGamingCount.bv');


const self = {
    cleanSuggestions: (from, to, eventId) => {
        return Promise.all([
            suggestionsRemover.removeFromUserSuggestions(from, to),
            suggestionsRemover.removeFromUserSuggestions(to, from),
        ]).then(() => {
            Logger.debug(`${eventId}\tSuggestions cleaned for {${from}} and {${to}}`);
        });
    },
    addMacaroon: async (from, to, sessionId, eventId) => {
        let userSession = await UserSessionModel.findOne({user_id: to, session_id: sessionId});
        if (!userSession) {
            userSession = new UserSessionModel({
                user_id: to,
                session_id: sessionId,
            });
        }
        userSession.addMacaroon(from);
        await userSession.save();
        Logger.debug(`${eventId}\tMacaroon added for {${to}} from {${from}}`);
    },
    updateGamingCount: (from, to, sessionId) => {
        return Promise.all([
            updateUserAndSessionGamingCountBehavior.increment(from, gamingTypes.MACAROONS_SENT, sessionId, gamingTypes.MACAROONS_SENT),
            updateUserAndSessionGamingCountBehavior.increment(to, gamingTypes.MACAROONS_RECEIVED, sessionId, gamingTypes.MACAROONS_RECEIVED),
        ])
    },
    handle: async (sessionId, from, to, eventId) => {
        return Promise.all([
            self.cleanSuggestions(from, to, eventId),
            self.addMacaroon(from, to, sessionId, eventId),
            self.updateGamingCount(from, to, sessionId),
        ]);
    }
};


module.exports = self;
