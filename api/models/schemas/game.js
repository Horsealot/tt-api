const mongoose = require('mongoose');
const {Schema} = mongoose;

const answerSchema = require('./games/answer');

const shuffleGameType = require('@models/types/shuffleGame');

const ShuffleGameSchema = new Schema({
    type: {
        type: Number,
        enum: Object.values(shuffleGameType),
        validate: {
            validator: Number.isInteger,
        }
    },
    label: {
        type: String,
        required: true
    },
    answers: {
        type: [answerSchema],
        default: []
    },
    usage: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
        }
    },
    answered: {
        type: Number,
        default: 0,
        validate: {
            validator: Number.isInteger,
        }
    }
});

module.exports = mongoose.model('ShuffleGame', ShuffleGameSchema);
