//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

const SessionSchema = new Schema({
    start_at: {
        type: Date,
        required: true
    },
    end_at: {
        type: Date,
        required: true
    }
});

SessionSchema.statics.findActive = async function () {
    const now = new Date();
    return await this.findOne({start_at: {'$lte': now}, end_at: {'$gte': now}});
};

module.exports = mongoose.model('Session', SessionSchema);
