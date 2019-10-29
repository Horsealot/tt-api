const eventTypes = require('./../types');
const Logger = require('@logger')('suggestionSkipped.listener.js');
const suggestionsRemover = require('@api/suggestions/remover');

module.exports = (emitter) => {
    emitter.on(eventTypes.SUGGESTION_SKIPPED, (data) => {
        Logger.debug(`${data.eventId}\tNew event {${eventTypes.SUGGESTION_SKIPPED}}`);
        if (!data.from) {
            Logger.error(`${data.eventId}\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`${data.eventId}\tMissing to data`);
        }
        suggestionsRemover.removeFromUserSuggestions(data.from, data.to);
        suggestionsRemover.removeFromUserSuggestions(data.to, data.from);
        Logger.debug(`${data.eventId}\tSuggestions cleaned for {${data.from}} and {${data.to}}`);
    });
};
