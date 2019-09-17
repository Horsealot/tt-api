const derivativeSchema = require('./pictureDerivative');
const { Schema } = require('mongoose');

module.exports = new Schema({
    created_at: {
        type: Date,
        default: Date.now
    },
    source: {
        type: String
    },
    order: {
        type: Number,
        validate : {
            validator : Number.isInteger,
        }
    },
    derivatives: [derivativeSchema]
});
