const {Schema} = require('mongoose');

module.exports = new Schema({
    height: {
        type: Number
    },
    width: {
        type: Number
    },
    source: {
        type: String
    },
});
