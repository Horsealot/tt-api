const {Schema} = require('mongoose');

const artistSchema = require('./artist');
const albumSchema = require('./album');

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: false
    },
    album: {
        type: albumSchema,
        required: false
    },
    artists: [artistSchema]
}, {_id: false});
