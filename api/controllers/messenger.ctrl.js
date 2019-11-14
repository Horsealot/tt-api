const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const connectionMembersLoader = require('@api/loaders/connectionMembers');
const ConnectionResponse = require('@models/responses/connection.response');
const MessageResponse = require('@models/responses/message.response');
const Logger = require('@logger')('messenger.ctrl.js');
const getConnectionPastMessagesBehavior = require('@api/behaviors/connections/getConnectionPastMessages.bv');

const self = {
    getConversation: async (req, res) => {
        try {
            let connection = await ConnectionModel.findOne({_id: req.params.id, members: req.user._id});
            if (!connection) return res.sendStatus(404);
            res.json(new ConnectionResponse(
                await connectionMembersLoader.load(connection, req.user._id),
                req.user
            ));
        } catch (e) {
            Logger.error(`getConversation: {${e.message}}`);
            Logger.debug(`getConversation error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
    getConversationPage: async (req, res) => {
        const {last_id} = req.query;
        try {
            let connection = await ConnectionModel.findOne({_id: req.params.id, members: req.user._id});
            if (!connection) return res.sendStatus(404);
            let messages = await getConnectionPastMessagesBehavior.get(connection, last_id);
            res.json(messages.map((message) => new MessageResponse(message)));
        } catch (e) {
            Logger.error(`getConversation: {${e.message}}`);
            Logger.debug(`getConversation error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
};

module.exports = self;
