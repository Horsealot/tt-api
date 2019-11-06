const mongoose = require('mongoose');
const {Schema} = mongoose;

const connectionStatus = require('./../types/connectionStatus');
const historySchema = require('./connections/history');
const messageSchema = require('./connections/messageBaseObject');

const ConnectionSchema = new Schema({
    members: [Schema.Types.ObjectId],
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

module.exports = mongoose.model('Connection', ConnectionSchema);
