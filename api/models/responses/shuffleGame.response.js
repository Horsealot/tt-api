class ShuffleGameResponse {
    constructor(shuffleGame) {
        this.type = shuffleGame.type;
        this.label = shuffleGame.label;
        if (shuffleGame.answers.length) {
            this.answers = shuffleGame.answers;
        }
    }
}

module.exports = ShuffleGameResponse;
