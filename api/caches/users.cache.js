const CacheService = require('@api/services/cache');

getUserKey = (userId) => `user__${userId}`;

class UserCache extends CacheService {
    static get(userId) {
        return super.get(getUserKey(userId));
    }

    static set(userId, value) {
        return super.set(getUserKey(userId), value);
    }
}

module.exports = UserCache;
