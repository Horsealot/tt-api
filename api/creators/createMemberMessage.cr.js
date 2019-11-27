const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const messageTypes = require('@models/types/message');

/**
 *
 * @param connection
 * @param sender
 * @param content
 * @return {Model}
 */
module.exports = (connection, sender, content) => new MessageModel({
    connection_id: connection._id,
    sender: sender._id,
    type: messageTypes.MESSAGE,
    readers: [{
        user_id: sender._id
    }],
    content: {
        data: content
    }
});
