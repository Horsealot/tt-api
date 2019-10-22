const {Schema} = require('mongoose');

const artistSchema = require('./artist');

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    album_type: {
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
    artists: [artistSchema],
}, {_id: false});
