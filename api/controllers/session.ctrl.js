const Logger = require('@logger')('session.ctrl.js');
const SuggestionEngine = require('@api/suggestions/engine');
const mongoose = require('mongoose');
const SessionModel = mongoose.model('Session');
const SessionResponse = require('@models/responses/session.response');

const self = {
    getSessionStatus: async (req, res) => {
        try {
            const nextSession = await SessionModel.findCurrentDisplayed();
            if (!nextSession) {
                return res.sendStatus(450);
            }
            // TODO previous_selection_completed
            res.json(new SessionResponse(nextSession, false));
        } catch (e) {
            Logger.error(`Get session status error: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    getSuggestions: async (req, res) => {
        const {user} = req;
        try {
            Logger.debug(`User ${req.user._id} requested his suggestions`);
            const userSuggestions = await SuggestionEngine.getUserSuggestions(user, req.sessionId);
            if (userSuggestions.length < 10) {
                // Trigger session refresh
            }
            res.json(userSuggestions);
        } catch (e) {
            Logger.error(`Get suggestions error: {${e.message}}`);
            res.sendStatus(503);
        }
    }
};

module.exports = self;
