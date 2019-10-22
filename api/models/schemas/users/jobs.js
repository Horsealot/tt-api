const {Schema} = require('mongoose');

module.exports = new Schema({
    title: {
        type: String,
    },
    company: {
        type: String,
    }
}, {_id: false});
