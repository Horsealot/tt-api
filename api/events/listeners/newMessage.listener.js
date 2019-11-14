const eventTypes = require('./../types');
const Logger = require('@logger')('newMacaroon.listener.js');
const newMessage = require('./../handlers/newMessage.handler');

const EVENT_LISTENED = eventTypes.MESSAGE_SENT;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.message) {
            Logger.error(`${data.eventId}\tMissing message data`);
        }
        if (!data.connectionId) {
            Logger.error(`${data.eventId}\tMissing connectionId data`);
        }
        try {
            await newMessage.handle(data.connectionId, data.from, data.message);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
