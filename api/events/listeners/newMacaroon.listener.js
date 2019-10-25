const eventTypes = require('./../types');
const Logger = require('@logger');
const suggestionsRemover = require('@api/suggestions/remover');

module.exports = (emitter) => {
    emitter.on(eventTypes.MACAROON_SENT, (data) => {
        Logger.debug(`newMacaroon.listener.js\tNew event {${eventTypes.MACAROON_SENT}}`);
        if (!data.from) {
            Logger.error(`newMacaroon.listener.js\tMissing from data`);
        }
        if (!data.to) {
            Logger.error(`newMacaroon.listener.js\tMissing to data`);
        }
        suggestionsRemover.removeFromUserSuggestions(data.from, data.to);
        suggestionsRemover.removeFromUserSuggestions(data.to, data.from);
        Logger.debug(`newMacaroon.listener.js\tSuggestions cleaned for {${data.from}} and {${data.to}}`);
    });
};
