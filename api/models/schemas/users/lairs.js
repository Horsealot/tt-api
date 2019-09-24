const {Schema} = require('mongoose');

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    graduation_date: {
        type: Date,
        required: true
    },
}, {_id: false});
