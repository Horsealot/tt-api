const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const eventTypes = require('./../types');
const Logger = require('@logger')('newMacaroon.listener.js');
const suggestionsRemover = require('@api/suggestions/remover');

const cleanSuggestions = (from, to, eventId) => {
    return Promise.all([
        suggestionsRemover.removeFromUserSuggestions(from, to),
        suggestionsRemover.removeFromUserSuggestions(to, from),
    ]).then(() => {
        Logger.debug(`${eventId}\tSuggestions cleaned for {${from}} and {${to}}`);
    });
};

const addMacaroon = async (from, to, sessionId, eventId) => {
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
};

module.exports = (emitter) => {
    emitter.on(eventTypes.MACAROON_SENT, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${eventTypes.MACAROON_SENT}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        if (!data.sessionId) {
            Logger.error(`${data.eventId}\tMissing sessionId data`);
        }
        await cleanSuggestions(data.from, data.to, data.eventId);
        await addMacaroon(data.from, data.to, data.sessionId, data.eventId);
        Logger.debug(`${data.eventId}\tEvent processed {${eventTypes.MACAROON_SENT}}`);
    });
};
