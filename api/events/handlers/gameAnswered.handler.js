const ShuffleGameModel = require('mongoose').model('ShuffleGame');
const gameType = require('@models/types/shuffleGame');

module.exports = {
    handle: async (gameId, userAnswer) => {
        const shuffleGame = await ShuffleGameModel.findOne({_id: gameId});
        if (!shuffleGame) throw new Error('Shuffle game not found');
        if (shuffleGame.type === gameType.TWO_CHOICES || shuffleGame.type === gameType.N_CHOICES) {
            let answer = shuffleGame.answers.find((gameAnswer) => gameAnswer.label === userAnswer);
            if (answer) answer.usage++;
        }
        await shuffleGame.save();
    }
};
