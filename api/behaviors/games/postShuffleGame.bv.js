const mongoose = require('mongoose');
const ShuffleGameModel = mongoose.model('ShuffleGame');
const Logger = require('@logger')('postShuffleGame.bv.js');
const ShuffleGamesCache = require('@api/caches/shuffleGames.cache');
const {NotFoundError} = require('@api/errors');
const shuffleGameMessageCreator = require('@api/creators/createShuffleGameMessage.cr');
const addToConversationBehavior = require('./../addToConversation.bv');

const self = {
    post: async (loggedUser, connection) => {
        const gameId = await ShuffleGamesCache.get(loggedUser._id, connection._id);
        if (!gameId) throw new NotFoundError('Shuffle game not found');
        const shuffleGame = await ShuffleGameModel.findOne({_id: gameId});
        if (!shuffleGame) throw new NotFoundError('Shuffle game not found');
        const message = shuffleGameMessageCreator(connection, loggedUser, shuffleGame);
        await addToConversationBehavior.add(connection, message);
        shuffleGame.usage++;
        await shuffleGame.save();
        Logger.debug(`{${loggedUser._id}} generated a shuffle game for the connection {${connection._id}}`);
        return message;
    },
};

module.exports = self;
