const {Schema} = require('mongoose');

module.exports = new Schema({
    at: {type: Date, default: Date.now},
    event: {type: Number, required: true},
    by: {type: Schema.Types.ObjectId, required: true},
    payload: {type: Object},
}, {_id: false});
