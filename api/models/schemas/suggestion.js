//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

const suggestionSchema = require('./suggestions/suggestions');
const sentSchema = require('./suggestions/sent');
const blockedSchema = require('./suggestions/blocked');

var SuggestionSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        unique: true
    },
    suggestions: suggestionSchema,
    sent: [sentSchema],
    blocked: [blockedSchema]
});


module.exports = mongoose.model('Suggestion', SuggestionSchema);
