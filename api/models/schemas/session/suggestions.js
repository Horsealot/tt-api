const {Schema} = require('mongoose');

module.exports = new Schema({
    refreshed_at: {
        type: Date
    },
    data: {
        type: [Schema.Types.ObjectId],
        default: []
    }
}, {_id: false});
