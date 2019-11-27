const eventTypes = require('./../types');
const Logger = require('@logger')('gameAnswered.listener.js');
const handler = require('./../handlers/gameAnswered.handler');

const EVENT_LISTENED = eventTypes.GAMING_GAME_ANSWERED;

module.exports = (emitter) => {
    emitter.on(EVENT_LISTENED, async (data) => {
        Logger.debug(`${data.eventId}\tNew event {${EVENT_LISTENED}}`);
        if (!data.gameId) {
            Logger.error(`${data.eventId}\tMissing gameId data`);
        }
        if (!data.answer) {
            Logger.error(`${data.eventId}\tMissing answer data`);
        }
        try {
            handler.handle(data.gameId, data.answer);
            Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
        } catch (e) {
            Logger.error(`${data.eventId}\tError while processing event {${EVENT_LISTENED}}`);
            // TODO Log event somewhere to reprocess it
        }
        Logger.debug(`${data.eventId}\tEvent processed {${EVENT_LISTENED}}`);
    });
};
