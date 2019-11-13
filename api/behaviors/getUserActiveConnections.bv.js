const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const connectionStatus = require('@models/types/connectionStatus');
const connectionMembersLoader = require('@api/loaders/connectionMembers');

const self = {
    /**
     * Get user active connections. If lastActiveAt is provided, we return only the connections active after the lastActiveAt
     * @return {Promise<[ConnectionModel]>}
     * @param user
     * @param lastActiveAt
     */
    get: async (user, lastActiveAt) => {
        let activeConnections;
        if (lastActiveAt) {
            activeConnections = await ConnectionModel.find({
                members: user._id,
                status: {'$ne': connectionStatus.EXPIRED},
                last_active_at: {'$gte': lastActiveAt}
            });
        } else {
            activeConnections = await ConnectionModel.find({
                members: user._id,
                status: {'$ne': connectionStatus.EXPIRED}
            });
        }
        activeConnections = activeConnections.map((connection) => connection.toObject());
        await Promise.all(activeConnections.map(async (connection) => {
            await connectionMembersLoader.load(connection, user._id);
        }));
        return activeConnections;
    },
};

module.exports = self;
