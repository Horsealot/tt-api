const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const Logger = require('@logger')('getConnectionPastMessages.bv.js');
const caster = require('@api/utils/caster');

const PAGE_SIZE = 50;

const self = {
    /**
     * @return {Promise<[MessageModel]>}
     * @param connection
     * @param last_id
     */
    get: async (connection, last_id) => {
        let query = {connection_id: connection._id};
        if (last_id) query = {...query, _id: {'$lt': caster.toObjectId(last_id)}};
        return (await MessageModel.find(query, {}, {sort: {'_id': -1}, limit: PAGE_SIZE})).reverse();
    },
};

module.exports = self;
