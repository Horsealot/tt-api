const EventEmitter = require('events').EventEmitter;

class TrikTrakEmitter extends EventEmitter {
    // Override to log events
}

const emitter = new TrikTrakEmitter();

require('./listeners/newMacaroon.listener')(emitter);
require('./listeners/refreshSuggestion.listener')(emitter);
require('./listeners/suggestionSkipped.listener')(emitter);

module.exports = emitter;

