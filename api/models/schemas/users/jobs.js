const {Schema} = require('mongoose');

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    }
}, {_id: false});
