const {Schema} = require('mongoose');

module.exports = new Schema({
    min_age: {
        type: Number,
        min: 18,
        max: 100,
        default: 18,
        required: true,
        validate: {
            validator: Number.isInteger,
        }
    },
    max_age: {
        type: Number,
        min: 18,
        max: 100,
        default: 50,
        required: true,
        validate: {
            validator: Number.isInteger,
        }
    },
    max_distance: {
        type: Number,
        min: 5,
        max: 180,
        default: 10,
        required: true,
        validate: {
            validator: Number.isInteger,
        }
    },
    gender: {
        type: String,
        default: 'M',
        enum: ['M', 'F', 'B'],
        required: true
    }
}, {_id: false});
