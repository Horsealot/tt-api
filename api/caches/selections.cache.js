const CacheService = require('@api/services/cache');

getSelectionKey = (userId) => `user-selection__${userId}`;

class SelectionsCache extends CacheService {
    static get(userId) {
        return super.get(getSelectionKey(userId));
    }

    static set(userId, value) {
        return super.set(getSelectionKey(userId), value);
    }
}

module.exports = SelectionsCache;
