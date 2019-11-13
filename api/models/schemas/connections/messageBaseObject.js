const {Schema} = require('mongoose');

module.exports = {
    sent_at: {type: Date, default: Date.now},
    content: {type: Object},
    type: {
        type: Number,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId
    },
    readers: [{
        user_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        at: {type: Date, default: Date.now},
    }]
};
