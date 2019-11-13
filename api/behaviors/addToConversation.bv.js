const Logger = require('@logger')('addToConversation.bv.js');
const createMemberMessage = require('@api/creators/createMemberMessage.cr');
const createNotificationMessage = require('@api/creators/createNotificationMessage.cr');

const self = {
    addMemberMessage: async (connection, sender, content) => {
        const message = createMemberMessage(connection, sender, content);
        await self.add(connection, message)
    },
    addNotification: async (connection, notification, at, payload) => {
        const message = createNotificationMessage(connection, notification, at, payload);
        await self.add(connection, message)
    },
    add: async (connection, message) => {
        connection.addMessage(message);
        await message.save();
        await connection.save();
        Logger.debug(`Message {${message._id}} sent by {${message.sender}} added to {${connection._id}}`);
    },
};

module.exports = self;
