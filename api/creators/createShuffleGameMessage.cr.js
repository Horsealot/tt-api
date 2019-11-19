const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const messageTypes = require('@models/types/message');

/**
 *
 * @param connection
 * @param sender
 * @param game
 * @return {Model}
 */
module.exports = (connection, sender, game) => new MessageModel({
    connection_id: connection._id,
    sender: sender._id,
    type: messageTypes.GAMING,
    content: {
        data: game.label,
        answers: game.answers
    }
});
