const {Schema} = require('mongoose');

module.exports = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String
    },
    expired_at: {
        type: Date,
        default: Date.now
    },
    public_source: {
        type: String
    },
});
