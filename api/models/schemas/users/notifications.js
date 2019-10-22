const {Schema} = require('mongoose');

module.exports = new Schema({
    new_message: {
        type: Boolean,
        default: true
    },
    new_game: {
        type: Boolean,
        default: true
    },
    new_game_answer: {
        type: Boolean,
        default: true
    },
    new_macaroon: {
        type: Boolean,
        default: true
    },
    round_reminder: {
        type: Boolean,
        default: true
    },
    selection_reminder: {
        type: Boolean,
        default: true
    },
    new_favorite: {
        type: Boolean,
        default: true
    },
    macaroon_accepted: {
        type: Boolean,
        default: true
    },
    player_nearby: {
        type: Boolean,
        default: true
    },
    signup_nearby: {
        type: Boolean,
        default: true
    },
    company_updates: {
        type: Boolean,
        default: true
    },
}, {_id: 0});
