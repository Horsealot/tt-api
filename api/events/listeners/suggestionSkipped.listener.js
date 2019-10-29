const eventTypes = require('./../types');
const Logger = require('@logger');
const suggestionsRemover = require('@api/suggestions/remover');

module.exports = (emitter) => {
    emitter.on(eventTypes.SUGGESTION_SKIPPED, (data) => {
        Logger.debug(`suggestionSkipped.listener.js\tNew event {${eventTypes.SUGGESTION_SKIPPED}}`);
        if (!data.from) {
            Logger.error(`suggestionSkipped.listener.js\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`suggestionSkipped.listener.js\tMissing to data`);
        }
        suggestionsRemover.removeFromUserSuggestions(data.from, data.to);
        suggestionsRemover.removeFromUserSuggestions(data.to, data.from);
        Logger.debug(`suggestionSkipped.listener.js\tSuggestions cleaned for {${data.from}} and {${data.to}}`);
    });
};
