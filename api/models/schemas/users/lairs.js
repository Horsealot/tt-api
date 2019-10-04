const {Schema} = require('mongoose');

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    placeId: {
        type: String,
        required: true
    }
}, {_id: false, strict: false});
