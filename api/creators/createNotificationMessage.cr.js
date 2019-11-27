const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const messageTypes = require('@models/types/message');

module.exports = (connection, content, at, payload) => new MessageModel({
    connection_id: connection._id,
    type: messageTypes.NOTIFICATION,
    readers: [],
    sent_at: at ? at : new Date(),
    content: {
        data: content,
        payload
    }
});
