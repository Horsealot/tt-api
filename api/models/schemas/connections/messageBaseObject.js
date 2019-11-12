const {Schema} = require('mongoose');

module.exports = new Schema({
    connection_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    sent_at: {type: Date, default: Date.now},
    content: {type: Object},
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    readers: [{
        user_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        at: {type: Date, default: Date.now},
    }]
});
