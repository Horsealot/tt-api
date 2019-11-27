const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const connectionStatus = require('@models/types/connectionStatus');

const self = {
    /**
     * Get active connection. Return null if the connection does not exists, or the user is not a part of it, or it is expired
     * @return {Promise<ConnectionModel>}
     * @param connectionId
     * @param userId
     */
    get: async (connectionId, userId) => {
        return await ConnectionModel.findOne({
            _id: connectionId,
            members: userId,
            status: {'$ne': connectionStatus.EXPIRED}
        });
    },
};

module.exports = self;
