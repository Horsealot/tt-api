const {Schema} = require('mongoose');

module.exports = new Schema({
    title: {
        type: String
    },
    institution: {
        type: String
    },
    graduation_date: {
        type: Date
    },
}, {_id: false});
