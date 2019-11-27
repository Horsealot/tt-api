const mongoose = require('mongoose');
const ShuffleGameModel = mongoose.model('ShuffleGame');
const Logger = require('@logger')('generateShuffleGame.bv.js');
const ShuffleGamesCache = require('@api/caches/shuffleGames.cache');

const self = {
    generate: async (loggedUser, connection) => {
        // const randomGame = await ShuffleGameModel.findOne({});
        const randomGames = await ShuffleGameModel.aggregate([
            {$sample: {size: 1}}
        ]);
        if (!randomGames.length) throw new Error('Unable to load a shuffle game');
        const randomGame = randomGames[0];
        await ShuffleGamesCache.set(loggedUser._id, connection._id, randomGame._id);
        Logger.debug(`{${loggedUser._id}} generated a shuffle game for the connection {${connection._id}}`);
        return randomGame;
    },
};

module.exports = self;
