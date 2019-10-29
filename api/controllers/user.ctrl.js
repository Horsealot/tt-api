const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('Session');
const UserBlacklistModel = mongoose.model('Blacklist');

const Logger = require('@logger');
const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const blacklistStatus = require('@api/models/schemas/session/blockedStatus');

module.exports = {
    sendMacaroon: async (req, res) => {
        const {payload: {id: loggedUserId}} = req;
        const {params: {userId: invitedUserId}} = req;
        try {
            let userSession = await UserSessionModel.findOne({
                user_id: loggedUserId,
                'suggestions.data': invitedUserId
            });
            if (!userSession) return res.sendStatus(403);
            userSession.addMacaroon(invitedUserId);
            await userSession.save();
            EventEmitter.emit(eventTypes.MACAROON_SENT, {from: loggedUserId, to: invitedUserId});
            res.sendStatus(200);
        } catch (e) {
            console.log(e);
            Logger.error(`user.ctrl.js\tSend maracoon error: {${e.message}}`);
            Logger.debug(`user.ctrl.js\tSend maracoon error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
    skipSuggestion: async (req, res) => {
        const {payload: {id: loggedUserId}} = req;
        const {params: {userId: invitedUserId}} = req;
        try {
            let userSession = await UserSessionModel.findOne({
                user_id: loggedUserId,
                'suggestions.data': invitedUserId
            });
            if (!userSession) return res.sendStatus(403);
            let userBlacklist = await UserBlacklistModel.findOne({user_id: loggedUserId});
            if (!userBlacklist) userBlacklist = new UserBlacklistModel({
                user_id: loggedUserId,
                status: blacklistStatus.SKIPPED
            });
            userBlacklist.addUser(invitedUserId);
            await userBlacklist.save();
            EventEmitter.emit(eventTypes.SUGGESTION_SKIPPED, {from: loggedUserId, to: invitedUserId});
            res.sendStatus(200);
        } catch (e) {
            Logger.error(`user.ctrl.js\tSuggestion skip error: {${e.message}}`);
            Logger.debug(`user.ctrl.js\tSuggestion skip error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
};
