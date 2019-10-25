//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

const suggestionSchema = require('./session/suggestions');
const sentSchema = require('./session/sent');
const blockedSchema = require('./session/blocked');

/* 1 HOUR */
const EXPIRATION_LIMIT = 60 * 60 * 1000;

const SessionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    suggestions: {
        type: suggestionSchema,
        default: suggestionSchema,
    },
    sent: [sentSchema],
    blocked: [blockedSchema]
});

SessionSchema.methods.setSuggestions = function (suggestions) {
    this.suggestions = {
        refreshed_at: new Date(),
        data: suggestions
    }
};

SessionSchema.methods.getSuggestions = function () {
    if (!this.suggestions.refreshed_at || ((new Date()) - this.suggestions.refreshed_at) > EXPIRATION_LIMIT) return null;
    return this.suggestions.data;
};

module.exports = mongoose.model('Session', SessionSchema);
