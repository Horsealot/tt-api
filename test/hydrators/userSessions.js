const mongoose = require('mongoose');
require('./../../api/models');
const UserSessionModel = mongoose.model('UserSession');

module.exports = {
    clean: () => {
        return UserSessionModel.deleteMany({})
    }
};
