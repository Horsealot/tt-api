const {Schema} = require('mongoose');

module.exports = new Schema({
    type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
});
