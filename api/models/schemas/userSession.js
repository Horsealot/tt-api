//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

const suggestionSchema = require('./session/suggestions');
const macaroonsSchema = require('./session/macaroons');
const caster = require('@api/utils/caster');

/* 1 HOUR */
const EXPIRATION_LIMIT = 60 * 60 * 1000;

const UserSessionSchema = new Schema({
    session_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
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
    macaroonsAccepted: {
        type: Number,
        default: 0
    },
    nbOfFavorites: {
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
    },
    favoritePicked: {
        type: Boolean,
        default: false
    }
});

UserSessionSchema.index({session_id: 1, user_id: 1}, {unique: true});

UserSessionSchema.methods.addMacaroon = function (user_id) {
    if (!this.macaroons.find((user) => caster.toString(user.user_id) === caster.toString(user_id))) {
        this.macaroons.push({
            user_id: caster.toObjectId(user_id)
        });
    }
};

UserSessionSchema.methods.setSuggestions = function (suggestions) {
    this.suggestions = {
        refreshed_at: new Date(),
        data: suggestions
    }
};

UserSessionSchema.methods.rmSuggestion = function (user_id) {
    this.suggestions.data = this.suggestions.data.filter((suggestionId) => caster.toString(suggestionId) !== caster.toString(user_id));
};

UserSessionSchema.methods.updateMacaroonStatus = function (user_id, status) {
    for (let i = 0; i < this.macaroons.length; i++) {
        if (caster.toString(this.macaroons[i].user_id) === caster.toString(user_id)) {
            this.macaroons[i].status = status;
            this.macaroons[i].answered_at = new Date();
        }
    }
};

UserSessionSchema.methods.getSuggestions = function () {
    if (!this.suggestions.refreshed_at || ((new Date()) - this.suggestions.refreshed_at) > EXPIRATION_LIMIT) return null;
    return this.suggestions.data;
};

module.exports = mongoose.model('UserSession', UserSessionSchema);
