const {Schema} = require('mongoose');

const artistSchema = require('./spotify/artist');
const trackSchema = require('./spotify/track');

module.exports = new Schema({
    artists: [artistSchema],
    tracks: [trackSchema],
}, {_id: 0});
