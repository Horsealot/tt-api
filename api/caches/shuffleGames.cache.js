const CacheService = require('@api/services/cache');

const getUserConnectionShuffleGame = (userId, connectionId) => `shuffle-game__${userId}__${connectionId}`;

class ShuffleGamesCache extends CacheService {
    static get(userId, connectionId) {
        return super.get(getUserConnectionShuffleGame(userId, connectionId));
    }

    static set(userId, connectionId, value) {
        return super.set(getUserConnectionShuffleGame(userId, connectionId), value);
    }
}

module.exports = ShuffleGamesCache;
