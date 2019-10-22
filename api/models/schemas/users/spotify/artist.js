const {Schema} = require('mongoose');

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    images: [
        {
            height: Number,
            width: Number,
            url: String
        }
    ],
    genres: [{
        type: String,
        required: false
    }],
}, {_id: false});
