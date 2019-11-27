const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const messageTypes = require('@models/types/message');

/**
 *
 * @param sender
 * @param message
 * @param answer
 * @return {Model}
 */
module.exports = (sender, message, answer) => new MessageModel({
    connection_id: message.connection_id,
    sender: sender._id,
    type: messageTypes.GAMING_ANSWER,
    content: {
        game_id: message.content.game_id,
        game_title: message.content.data,
        data: answer,
    }
});
