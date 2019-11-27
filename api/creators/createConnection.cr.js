const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');

/**
 *
 * @param sessionId
 * @param userIds
 * @param createdAt
 */
module.exports = (sessionId, userIds, createdAt) => new ConnectionModel({
    session_id: sessionId,
    members: userIds,
    created_at: createdAt ? createdAt : new Date()
});
