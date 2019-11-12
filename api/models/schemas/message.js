const mongoose = require('mongoose');
const {Schema} = mongoose;

const messageBaseObject = require('./connections/messageBaseObject');

const MessageSchema = new Schema({
    connection_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ...messageBaseObject
});

module.exports = mongoose.model('Message', MessageSchema);
