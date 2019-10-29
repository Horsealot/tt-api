const eventTypes = require('./../types');
const Logger = require('@logger')('refreshSuggestion.listener.js');

const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('Session');
const UserModel = mongoose.model('User');

const suggestionEngine = require('@api/suggestions/engine');
const caster = require('@api/utils/caster');

const SessionsCache = require('@api/caches/sessions.cache');

module.exports = (emitter) => {
    emitter.on(eventTypes.REFRESH_SUGGESTIONS, async (data) => {
        // Replace by queueing system
        Logger.debug(`${data.eventId}\tNew event {${eventTypes.REFRESH_SUGGESTIONS}}`);
        if (!data.userId) {
            Logger.error(`${data.eventId}\tMissing userId`);
        }
        const user = await UserModel.findOne({_id: data.userId});
        if (!user) {
            Logger.error(`${data.eventId}\tUnknown user`);
        }

        let userSession = await UserSessionModel.findOne({user_id: caster.toObjectId(data.userId)});
        if (!userSession) {
            userSession = new UserSessionModel({user_id: caster.toObjectId(data.userId)})
        }
        suggestionEngine.refreshSuggestions(user, userSession);
        await userSession.save();
        await SessionsCache.set(user.id, userSession.getSuggestions());
        Logger.debug(`${data.eventId}\tEvent processed {${eventTypes.REFRESH_SUGGESTIONS}}`);
    });
};
