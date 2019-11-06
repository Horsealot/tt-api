const EventEmitter = require('events').EventEmitter;
const uniqid = require('uniqid');

class TrikTrakEmitter extends EventEmitter {
    // Override to log events
    emit = (event, data) => {
        data.eventId = uniqid();
        super.emit(event, data);
    }
}

const emitter = new TrikTrakEmitter();

require('./listeners/newMacaroon.listener')(emitter);
require('./listeners/macaroonRefused.listener')(emitter);
require('./listeners/macaroonAccepted.listener')(emitter);
require('./listeners/refreshSuggestion.listener')(emitter);
require('./listeners/suggestionSkipped.listener')(emitter);

module.exports = emitter;

