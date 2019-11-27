const mongoose = require('mongoose');
const ShuffleGameModel = mongoose.model('ShuffleGame');
const MessageModel = mongoose.model('Message');
const Logger = require('@logger')('answerShuffleGame.bv.js');
const {NotFoundError, UnauthorizedError} = require('@api/errors');
const shuffleGameAnswerMessageCreator = require('@api/creators/createShuffleGameAnswerMessage.cr');
const addToConversationBehavior = require('./../addToConversation.bv');
const flagGameMessageAsAnsweredBehavior = require('./flagGameMessageAsAnswered.bv');
const validateAnswerBehavior = require('./validateAnswer.bv');
const caster = require('@api/utils/caster');
const messageType = require('@models/types/message');
const errorType = require('@models/types/errors');

const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const self = {
    post: async (loggedUser, connection, messageId, answer) => {
        const message = await MessageModel.findOne({
            connection_id: connection._id,
            _id: messageId,
            type: messageType.GAMING
        });
        if (!message) throw new NotFoundError('Shuffle game not found');
        if (message.content.answered_by.find((id) => caster.compareObjectId(id, loggedUser._id))) throw new UnauthorizedError(errorType.GAMING_ALREADY_ANSWERED);
        if (message.sender === loggedUser._id) throw new UnauthorizedError(errorType.GAMING_SENDER_NOT_ALLOWED);
        const game = await ShuffleGameModel.findOne({_id: caster.toObjectId(message.content.game_id)});
        if (!game) throw new NotFoundError('Shuffle game not found');
        if (!validateAnswerBehavior.isValid(game, answer)) throw new UnauthorizedError(errorType.GAMING_INVALID_ANSWER);
        const answerMessage = shuffleGameAnswerMessageCreator(loggedUser, message, answer);
        await addToConversationBehavior.add(connection, answerMessage);
        await answerMessage.save();
        await flagGameMessageAsAnsweredBehavior.flag(loggedUser, connection, message);
        EventEmitter.emit(eventTypes.GAMING_GAME_ANSWERED, {gameId: message.content.game_id, answer});
        Logger.debug(`{${loggedUser._id}} answered the {${message._id}} game`);
        return answerMessage;
    },
};

module.exports = self;
