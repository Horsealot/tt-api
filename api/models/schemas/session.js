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

SessionSchema.methods.isActive = function () {
    return this.start_at <= new Date() && this.end_at >= new Date();
};

SessionSchema.statics.findActive = async function () {
    const now = new Date();
    return await this.findOne({start_at: {'$lte': now}, end_at: {'$gte': now}});
};

SessionSchema.statics.findCurrentDisplayed = async function () {
    return await this.findOne({end_at: {'$gte': new Date()}}, null, {sort: {end_at: 1}});
};

SessionSchema.statics.findSessionForSelection = async function () {
    return await this.findOne({end_at: {'$lte': new Date()}}, null, {sort: {end_at: -1}});
};

module.exports = mongoose.model('Session', SessionSchema);
