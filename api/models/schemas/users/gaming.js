const {Schema} = require('mongoose');

module.exports = new Schema({
    session_participated: {
        type: Number,
        default: 0,
        min: 0,
    },
    macaroons_received: {
        type: Number,
        default: 0,
        min: 0,
    },
    macaroons_sent: {
        type: Number,
        default: 0,
        min: 0,
    },
    macaroons_accepted: {
        type: Number,
        default: 0,
        min: 0,
    },
    macaroons_refused: {
        type: Number,
        default: 0,
        min: 0,
    },
    favorite_picked: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {_id: 0});
