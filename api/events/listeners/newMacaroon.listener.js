const eventTypes = require('./../types');
const Logger = require('@logger')('newMacaroon.listener.js');
const suggestionsRemover = require('@api/suggestions/remover');

const cleanSuggestions = (from, to, eventId) => {
    return Promise.all([
        suggestionsRemover.removeFromUserSuggestions(from, to),
        suggestionsRemover.removeFromUserSuggestions(to, from),
    ]).then(() => {
        Logger.debug(`${eventId}\tSuggestions cleaned for {${from}} and {${to}}`);
    });
};

module.exports = (emitter) => {
    emitter.on(eventTypes.MACAROON_SENT, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${eventTypes.MACAROON_SENT}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        await cleanSuggestions(data.from, data.to);
        Logger.debug(`${data.eventId}\tEvent processed {${eventTypes.MACAROON_SENT}}`);
    });
};
