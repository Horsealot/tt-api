const {Schema} = require('mongoose');
const validationStatusConverter = require('@models/converters/validationStatus');

module.exports = new Schema({
    status: {
        type: Number,
        default: validationStatusConverter.NOT_VALIDATED
    },
    reason: {
        type: Number
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    },
    source: String
}, {_id: 0});
