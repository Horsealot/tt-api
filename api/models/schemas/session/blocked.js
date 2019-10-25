const {Schema} = require('mongoose');

module.exports = new Schema({
    at: {
        type: Date,
        default: Date.now
    },
    user_id: Schema.Types.ObjectId
}, {_id: false});
