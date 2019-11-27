const connectionMembersLoader = require('@api/loaders/connectionMembers');
const ConnectionResponse = require('@models/responses/connection.response');
const MessageResponse = require('@models/responses/message.response');
const ShuffleGameResponse = require('@models/responses/shuffleGame.response');
const Logger = require('@logger')('messenger.ctrl.js');
const getConnectionPastMessagesBehavior = require('@api/behaviors/connections/getConnectionPastMessages.bv');
const addToConversationBehavior = require('@api/behaviors/addToConversation.bv');
const generateShuffleGameBehavior = require('@api/behaviors/games/generateShuffleGame.bv');
const postShuffleGameBehavior = require('@api/behaviors/games/postShuffleGame.bv');
const answerShuffleGameBehavior = require('@api/behaviors/games/answerShuffleGame.bv');

const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const self = {
    getConnection: async (req, res) => {
        try {
            res.json(new ConnectionResponse(
                await connectionMembersLoader.load(req.connection, req.user._id),
                req.user
            ));
        } catch (e) {
            Logger.error(`getConversation: {${e.message}}`);
            Logger.debug(`getConversation error: {${e.stack}}`);
            res.sendStatus(503);
        }
    },
    markAsRead: async (req, res) => {
        try {
            req.connection.readBy(req.user._id);
            await req.connection.save();
            res.sendStatus(200);
        } catch (e) {
            Logger.error(`Mark connection as read: {${e.message}}`);
            Logger.debug(`Mark connection as read: {${e.stack}}`);
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
            Logger.debug(`postMessage error: {${e.stack}}`);
            res.sendStatus(503);
        }
    },
    getConnectionPage: async (req, res) => {
        const {last_id} = req.query;
        try {
            let messages = await getConnectionPastMessagesBehavior.get(req.connection, last_id);
            res.json(messages.map((message) => new MessageResponse(message)));
        } catch (e) {
            Logger.error(`getConnectionPage: {${e.message}}`);
            Logger.debug(`getConnectionPage error: {${e.stack}}`);
            res.sendStatus(503);
        }
    },
    getShuffleGame: async (req, res) => {
        try {
            let game = await generateShuffleGameBehavior.generate(req.user._id, req.connection._id);
            res.json(new ShuffleGameResponse(game));
        } catch (e) {
            Logger.error(`getShuffleGame: {${e.message}}`);
            Logger.debug(`getShuffleGame error: {${e.stack}}`);
            res.sendStatus(503);
        }
    },
    postShuffleGame: async (req, res) => {
        try {
            let message = await postShuffleGameBehavior.post(req.user, req.connection);
            res.json(new MessageResponse(message));
        } catch (e) {
            Logger.error(`postShuffleGame: {${e.message}}`);
            Logger.debug(`postShuffleGame error: {${e.stack}}`);
            res.sendStatus(503);
        }
    },
    answerShuffleGame: async (req, res) => {
        const {params: {messageId}} = req;
        const answer = req.body.answer || req.body.rating;
        let message = await answerShuffleGameBehavior.post(req.user, req.connection, messageId, answer);
        res.json(new MessageResponse(message));
    },
};

module.exports = self;
