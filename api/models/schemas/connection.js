const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectionStatus = require('./../types/connectionStatus');
const historySchema = require('./connections/history');
const messageSchema = require('./connections/messageBaseObject');

const MESSAGES_LIMIT = 200;

const ConnectionSchema = new Schema({
    members: [Schema.Types.ObjectId],
    session_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    last_active_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now},
    status: {
        type: Number,
        default: connectionStatus.IN_SESSION
    },
    history: [historySchema],
    nb_of_messages: {
        type: Number,
        default: 0
    },
    messages: [messageSchema]
});

ConnectionSchema.index({"members": 1}, {unique: true});

/**
 * Add history
 * @param event
 * @param by
 * @param at
 * @param payload
 */
ConnectionSchema.methods.addHistory = function (event, by, at, payload) {
    this.history.push({
        at,
        event,
        by,
        payload
    });
};

/**
 * Add a message to the connection
 * @param message
 */
ConnectionSchema.methods.addMessage = function (message) {
    this.messages.push(message);
    if (this.messages.length > MESSAGES_LIMIT) this.messages.shift();
};

module.exports = mongoose.model('Connection', ConnectionSchema);
