const {Schema} = require('mongoose');

const blockedStatus = require('./blockedStatus');

module.exports = new Schema({
    at: {
        type: Date,
        default: Date.now
    },
    user_id: Schema.Types.ObjectId,
    status: {
        type: Number,
        default: blockedStatus.SKIPPED
    }
}, {_id: false});
