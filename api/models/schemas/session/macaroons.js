const {Schema} = require('mongoose');
const macaroonStatus = require('./macaroonStatus');

module.exports = new Schema({
    sent_at: {
        type: Date, default: Date.now
    },
    answered_at: {
        type: Date
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        default: macaroonStatus.NEW
    }
}, {_id: false});
