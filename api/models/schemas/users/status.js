const {Schema} = require('mongoose');

module.exports = new Schema({
    locked: {
        type: Boolean,
        default: false
    },
    reasons: [Number]
}, {_id: 0});
