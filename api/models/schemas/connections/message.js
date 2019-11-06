const {Schema} = require('mongoose');

const messageBaseObject = require('./messageBaseObject');

module.exports = new Schema(messageBaseObject, {_id: 0});
