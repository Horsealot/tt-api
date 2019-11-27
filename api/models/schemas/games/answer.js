const {Schema} = require('mongoose');

module.exports = new Schema({
    label: {
        type: String,
        required: true
    },
    usage: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
        }
    },
});
