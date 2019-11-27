const ShuffleGameModel = require('mongoose').model('ShuffleGame');

module.exports = {
    handle: async (gameId) => {
        const shuffleGame = await ShuffleGameModel.findOne({_id: gameId});
        if (!shuffleGame) throw new Error('Shuffle game not found');
        shuffleGame.usage++;
        await shuffleGame.save();
    }
};
