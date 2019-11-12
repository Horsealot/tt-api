const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const connectionEvent = require('@models/types/connectionEvent');
const Logger = require('@logger')('createConnection.bv.js');

const self = {
    /**
     * Create connection between the inviter and the invited user
     * @param sessionId
     * @param inviter
     * @param invited
     * @param invitedAt When the macaroon was sent
     * @return {Promise<void>}
     */
    create: async (sessionId, inviter, invited, invitedAt) => {
        let existingConnection = await ConnectionModel.findOne({
            '$and': [
                {'members': inviter},
                {'members': invited},
            ]
        });
        if (existingConnection) throw new Error('Connection already exists');
        existingConnection = new ConnectionModel({
            session_id: sessionId,
            members: [inviter, invited]
        });
        existingConnection.addHistory(connectionEvent.SEND_MACAROON, inviter, invitedAt);
        existingConnection.addHistory(connectionEvent.ACCEPTED_MACAROON, invited, new Date());
        await existingConnection.save();
        Logger.debug(`Connection created between {${inviter}} and {${invited}}`);
        return existingConnection;
    },
};

module.exports = self;
