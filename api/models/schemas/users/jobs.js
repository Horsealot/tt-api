const {Schema} = require('mongoose');

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    }
}, {_id: false});
