const eventTypes = require('./../types');
const refuseMacaroon = require('./../handlers/macaroonRefused.handler');
const Logger = require('@logger')('macaroonRefused.listener.js');

const EVENT_LISTENED = eventTypes.MACAROON_REFUSED;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        if (!data.sessionId) {
            Logger.error(`${data.eventId}\tMissing sessionId data`);
        }
        try {
            await refuseMacaroon.handle(data.sessionId, data.from, data.to);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
    });
};
