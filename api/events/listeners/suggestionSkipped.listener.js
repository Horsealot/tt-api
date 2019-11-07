const eventTypes = require('./../types');
const Logger = require('@logger')('suggestionSkipped.listener.js');
const handler = require('./../handlers/suggestionSkipped.handler');
const EVENT_LISTENED = eventTypes.SUGGESTION_SKIPPED;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, (data) => {
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        try {
            handler.handle(data.from, data.to);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
        Logger.debug(`${data.eventId}\tSuggestions cleaned for {${data.from}} and {${data.to}}`);
    });
};
