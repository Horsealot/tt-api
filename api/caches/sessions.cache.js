const CacheService = require('@api/services/cache');

getSessionKey = (userId) => `user-session__${userId}`;

class SessionsCache extends CacheService {
    static get(userId) {
        return super.get(getSessionKey(userId));
    }

    static set(userId, value) {
        return super.set(getSessionKey(userId), value);
    }
}

module.exports = SessionsCache;
