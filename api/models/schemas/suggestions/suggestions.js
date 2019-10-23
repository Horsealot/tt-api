const {Schema} = require('mongoose');

module.exports = new Schema({
    refreshed_at: {
        type: Date
    },
    data: [Schema.Types.ObjectId]
}, {_id: false});
