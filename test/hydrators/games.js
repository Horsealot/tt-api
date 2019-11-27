const mongoose = require('mongoose');
require('./../../api/models');
const ShuffleGameModel = mongoose.model('ShuffleGame');

module.exports = {
    clean: () => {
        return ShuffleGameModel.deleteMany({})
    }
};
