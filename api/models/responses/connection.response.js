const MessageResponse = require('./message.response');
const UserResponse = require('./user.response');
const countUserUnreadMessagesBehavior = require('@api/behaviors/countUserUnreadMessages.bv');

class ConnectionResponse {
    constructor(connection, loggedUser) {
        this.id = connection._id;
        this.members = connection.members.map((member) => new UserResponse(member));
        this.status = connection.status;
        this.created_at = connection.created_at;
        this.last_active_at = connection.last_active_at;
        this.messages = connection.messages.map((message) => new MessageResponse(message));
        this.unread_messages = countUserUnreadMessagesBehavior.count(loggedUser, connection);
    }
}

module.exports = ConnectionResponse;
