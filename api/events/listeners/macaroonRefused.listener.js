const eventTypes = require('./../types');
const refuseMacaroon = require('@api/behaviors/refuseMacaroon.bv');
const Logger = require('@logger')('newMacaroon.listener.js');

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
        await refuseMacaroon.refuseForUserId(data.sessionId, data.from, data.to);
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
