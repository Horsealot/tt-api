const mongoose = require('mongoose');
require('./../../api/models');
const MessageModel = mongoose.model('Message');

module.exports = {
    clean: () => {
        return MessageModel.deleteMany({})
    }
};
