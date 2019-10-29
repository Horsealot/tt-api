//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

const suggestionSchema = require('./session/suggestions');
const macaroonsSchema = require('./session/macaroons');
const caster = require('@api/utils/caster');

/* 1 HOUR */
const EXPIRATION_LIMIT = 60 * 60 * 1000;

const SessionSchema = new Schema({
    session_id: Number,
    user_id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    suggestions: {
        type: suggestionSchema,
        default: suggestionSchema,
    },
    macaroons: [macaroonsSchema],
    macaroonsReceived: {
        type: Number,
        default: 0
    },
    macaroonsSent: {
        type: Number,
        default: 0
    },
    macaroonsRefused: {
        type: Number,
        default: 0
    },
    skipped: {
        type: Number,
        default: 0
    },
    messagesSent: {
        type: Number,
        default: 0
    }
});

SessionSchema.methods.addMacaroon = function (user_id) {
    if (!this.macaroons.find((user) => caster.toString(user.user_id) === caster.toString(user_id))) {
        this.macaroons.push({
            user_id: caster.toObjectId(user_id)
        });
    }
};

SessionSchema.methods.setSuggestions = function (suggestions) {
    this.suggestions = {
        refreshed_at: new Date(),
        data: suggestions
    }
};

SessionSchema.methods.rmSuggestion = function (user_id) {
    this.suggestions.data = this.suggestions.data.filter((suggestionId) => caster.toString(suggestionId) !== caster.toString(user_id));
};

SessionSchema.methods.getSuggestions = function () {
    if (!this.suggestions.refreshed_at || ((new Date()) - this.suggestions.refreshed_at) > EXPIRATION_LIMIT) return null;
    return this.suggestions.data;
};

module.exports = mongoose.model('Session', SessionSchema);
