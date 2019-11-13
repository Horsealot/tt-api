class MessageResponse {
    constructor(message) {
        this.id = message._id;
        this.sent_at = message.sent_at;
        this.sender = message.sender;
        this.type = message.type;
        this.content = message.content;
    }
}

module.exports = MessageResponse;
