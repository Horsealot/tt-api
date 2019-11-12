const eventTypes = require('./../types');
const Logger = require('@logger')('macaroonAccepted.listener.js');
const handler = require('./../handlers/selectionPicked.handler');

const EVENT_LISTENED = eventTypes.SELECTION_PICKED;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        try {
            handler.handle(data.from, data.to, data.isMutual);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
