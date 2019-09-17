const { Schema } = require('mongoose');

module.exports = new Schema({
    title: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
    }
},{ _id : false });
