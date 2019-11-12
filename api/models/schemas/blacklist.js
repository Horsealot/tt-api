const mongoose = require('mongoose');
const {Schema} = mongoose;

const blockedSchema = require('./session/blocked');

const BlacklistSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        unique: true,
        index: true
    },
    data: [blockedSchema]
});

BlacklistSchema.methods.addUser = function (user_id, status) {
    if (!this.data.find((user) => user.user_id.toString() === user_id.toString())) {
        this.data.push({
            user_id,
            status
        });
    }
};

module.exports = mongoose.model('Blacklist', BlacklistSchema);
