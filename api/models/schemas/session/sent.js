const {Schema} = require('mongoose');

module.exports = new Schema({
    at: {
        type: Date
    },
    user_id: Schema.Types.ObjectId
}, {_id: false});
