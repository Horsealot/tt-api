const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');

const suggestionEngine = require('@api/suggestions/engine');
const caster = require('@api/utils/caster');

const SessionsCache = require('@api/caches/sessions.cache');

module.exports = {
    handle: async (sessionId, user) => {
        let userSession = await UserSessionModel.findOne({
            user_id: caster.toObjectId(user._id),
            session_id: caster.toObjectId(sessionId)
        });
        if (!userSession) {
            userSession = new UserSessionModel({
                user_id: caster.toObjectId(user._id),
                session_id: caster.toObjectId(sessionId)
            })
        }
        suggestionEngine.refreshSuggestions(user, userSession);
        await userSession.save();
        await SessionsCache.set(user.id, userSession.getSuggestions());
    }
};
