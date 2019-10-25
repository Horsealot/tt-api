const CacheService = require('@api/services/cache');

getUserKey = (userId) => `user-session__${userId}`;

class SessionsCache extends CacheService {
    static get(userId) {
        return super.get(getUserKey(userId));
    }

    static set(userId, value) {
        return super.set(getUserKey(userId), value);
    }
}

module.exports = SessionsCache;
