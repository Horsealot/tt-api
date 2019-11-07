const eventTypes = require('./../types');
const Logger = require('@logger')('refreshSuggestion.listener.js');

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');

const handler = require('./../handlers/refreshSuggestion.handler');

const EVENT_LISTENED = eventTypes.REFRESH_SUGGESTIONS;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, async (data) => {
        // Replace by queueing system
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.userId) {
            Logger.error(`${data.eventId}\tMissing userId`);
        }
        if (!data.sessionId) {
            Logger.error(`${data.eventId}\tMissing sessionId`);
        }
        const user = await UserModel.findOne({_id: data.userId});
        if (!user) {
            Logger.error(`${data.eventId}\tUnknown user`);
        }
        try {
            await handler.handle(data.sessionId, user);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
