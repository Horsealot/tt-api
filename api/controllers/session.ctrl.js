const Logger = require('@logger')('session.ctrl.js');
const SuggestionEngine = require('@api/suggestions/engine');
const mongoose = require('mongoose');
const SessionModel = mongoose.model('Session');
const UserSessionModel = mongoose.model('UserSession');
const {UnauthorizedError} = require('@api/errors');

const SessionResponse = require('@models/responses/session.response');

const getUserSelectionBehavior = require('@api/behaviors/getUserSelection.bv');
const pickUserSelectionBehavior = require('@api/behaviors/pickUserSelection.bv');
const organizeUserSelectionBehavior = require('@api/behaviors/organizeUserSelection.bv');
const getUserPreviousSelectionCompletedBehavior = require('@api/behaviors/getUserPreviousSelectionCompleted.bv');

const self = {
    getSessionStatus: async (req, res) => {
        const {payload: {id: userId = null} = {}} = req;
        try {
            const nextSession = await SessionModel.findCurrentDisplayed();
            if (!nextSession) {
                return res.sendStatus(450);
            }
            const previousSelectionCompleted = userId ? await getUserPreviousSelectionCompletedBehavior.get(nextSession, userId) : true;
            res.json(new SessionResponse(nextSession, previousSelectionCompleted));
        } catch (e) {
            Logger.error(`Get session status error: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    getAvailableFavorites: async (req, res) => {
        const {payload: {id: userId}} = req;
        try {
            const session = await SessionModel.findSessionForSelection();
            if (!session) {
                return res.sendStatus(450);
            }
            const userSession = await UserSessionModel.findOne({user_id: userId, session_id: session.id});
            if (!userSession) {
                Logger.debug(`User {${userId}} requested his available favorites but didn't participate in session {${session.id}}`);
                return res.json([]);
            }
            if (userSession.favoritePicked) {
                return res.sendStatus(403);
            }
            const selections = await getUserSelectionBehavior.get(userId, session._id);
            const organizedSelections = organizeUserSelectionBehavior.organizeByRounds(selections);

            res.json({
                number_of_rounds: organizedSelections.length,
                selections: organizedSelections
            });
        } catch (e) {
            Logger.error(`Get available favorites error: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    pickFavorite: async (req, res) => {
        const {payload: {id: userId}} = req;
        const {params: {userId: pickedUserId}} = req;
        try {
            const session = await SessionModel.findSessionForSelection();
            if (!session) {
                return res.sendStatus(450);
            }
            await pickUserSelectionBehavior.pick(session, userId, pickedUserId);

            res.sendStatus(200);
        } catch (e) {
            if (e instanceof UnauthorizedError) {
                Logger.debug(`Pick favorite unauthorized access: {${e.message} / ${JSON.stringify(e.data)}}`);
                res.sendStatus(403);
            } else {
                Logger.error(`Pick favorite error: {${e.message}}`);
                res.sendStatus(503);
            }
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
