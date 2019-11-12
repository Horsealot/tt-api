const {Schema} = require('mongoose');

module.exports = new Schema({
    user_id: Schema.Types.ObjectId,
}, {_id: false});
