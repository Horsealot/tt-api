const eventTypes = require('./../types');
const acceptMacaroon = require('@api/behaviors/acceptMacaroon.bv');
const Logger = require('@logger')('macaroonAccepted.listener.js');

const EVENT_LISTENED = eventTypes.MACAROON_ACCEPTED;

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
        await acceptMacaroon.acceptForUserId(data.sessionId, data.from, data.to);
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
