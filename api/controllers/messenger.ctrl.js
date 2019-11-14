const connectionMembersLoader = require('@api/loaders/connectionMembers');
const ConnectionResponse = require('@models/responses/connection.response');
const MessageResponse = require('@models/responses/message.response');
const Logger = require('@logger')('messenger.ctrl.js');
const getConnectionPastMessagesBehavior = require('@api/behaviors/connections/getConnectionPastMessages.bv');
const addToConversationBehavior = require('@api/behaviors/addToConversation.bv');


const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const self = {
    getConversation: async (req, res) => {
        try {
            res.json(new ConnectionResponse(
                await connectionMembersLoader.load(req.connection, req.user._id),
                req.user
            ));
        } catch (e) {
            Logger.error(`getConversation: {${e.message}}`);
            Logger.debug(`getConversation error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
    postMessage: async (req, res) => {
        const {body: {message: content}} = req;
        try {
            const message = await addToConversationBehavior.addMemberMessage(req.connection, req.user, content);
            EventEmitter.emit(eventTypes.MESSAGE_SENT, {
                from: req.user._id,
                connectionId: req.connection._id,
                message: content
            });
            res.json(new MessageResponse(message));
        } catch (e) {
            Logger.error(`postMessage: {${e.message}}`);
            Logger.debug(`postMessage error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
    getConversationPage: async (req, res) => {
        const {last_id} = req.query;
        try {
            let messages = await getConnectionPastMessagesBehavior.get(req.connection, last_id);
            res.json(messages.map((message) => new MessageResponse(message)));
        } catch (e) {
            Logger.error(`getConversation: {${e.message}}`);
            Logger.debug(`getConversation error: {${JSON.stringify(e)}}`);
            res.sendStatus(503);
        }
    },
};

module.exports = self;
