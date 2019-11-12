const mongoose = require('mongoose');
require('./../../api/models');
const ConnectionModel = mongoose.model('Connection');

module.exports = {
    clean: () => {
        return ConnectionModel.deleteMany({})
    }
};
