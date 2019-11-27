const gameType = require('@models/types/shuffleGame');
const ratingValidator = require('@models/validators/gaming/rating.validator');

const self = {
    isValid: (game, answer) => {
        switch (game.type) {
            case gameType.RATING:
                const {error} = ratingValidator.validate(answer);
                return error === undefined;
            case gameType.OPEN_QUESTION:
                return answer !== null && answer !== undefined;
            case gameType.TWO_CHOICES:
                return game.answers.find((authorizedAnswer) => authorizedAnswer.label === answer) !== undefined;
            case gameType.N_CHOICES:
                return game.answers.find((authorizedAnswer) => authorizedAnswer.label === answer) !== undefined;
        }
    },
};

module.exports = self;
