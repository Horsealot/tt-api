const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const connectionEvent = require('@models/types/connectionEvent');
const Logger = require('@logger')('createConnection.bv.js');
const addToConversationBehavior = require('./addToConversation.bv');
const createConnection = require('@api/creators/createConnection.cr');

const self = {
    /**
     * Create connection between the inviter and the invited user
     * @param sessionId
     * @param inviter
     * @param invited
     * @param invitedAt When the macaroon was sent
     * @return {Promise<ConnectionModel>}
     */
    create: async (sessionId, inviter, invited, invitedAt) => {
        const createdAt = new Date();
        if (await ConnectionModel.findOne({
            '$and': [
                {'members': inviter},
                {'members': invited},
            ]
        })) {
            throw new Error('Connection already exists');
        }
        let connection = createConnection(sessionId, [inviter, invited], createdAt);
        connection.addHistory(connectionEvent.SEND_MACAROON, inviter, invitedAt);
        connection.addHistory(connectionEvent.ACCEPTED_MACAROON, invited, createdAt);
        await connection.save();
        await addToConversationBehavior.addNotification(connection, 'TODO SEND MACAROON', invitedAt, {sender: inviter});
        await addToConversationBehavior.addNotification(connection, 'TODO ACCEPT MACAROON', createdAt, {sender: invited});
        Logger.debug(`Connection created between {${inviter}} and {${invited}}`);
        return connection;
    },
};

module.exports = self;
