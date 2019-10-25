const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('Session');
const UserModel = mongoose.model('User');
const QueryFilter = require('./query');
const SessionsCache = require('@api/caches/sessions.cache');
const ProfileLoader = require('@api/loaders/profile');
const UserResponse = require('@api/models/responses/user.response');
const Logger = require('@logger');

const loadUsers = (userIds) => {
    let users = [];
    return Promise.all(userIds.map((userId) => {
        return new Promise((resolve) => {
            ProfileLoader.get(userId).then((user) => {
                users.push(user);
            }).catch().finally(() => resolve());
        });
    })).then(() => users);
};

const areSuggestionsExpired = (session) => {
    if (!session.getSuggestions() || !session.getSuggestions().length) return true;
    // TODO Add freshness
    return false;
};

const getBlackList = async (user, session) => {
    // TODO Add active conversations
    return [
        user._id,
        ...session.sent.map((sent) => sent.user_id),
        ...session.blocked.map((blocked) => blocked.user_id)
    ];
};

const refreshSuggestions = async (user, session) => {
    const blacklist = await getBlackList(user, session);
    return new Promise((resolve, reject) => {
        const userQuery = new QueryFilter(user, blacklist);
        UserModel.aggregate(userQuery.generate()).exec((err, users) => {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        })
    });
};

const self = {
    getUserSuggestions: async (user) => {
        const cachedSuggestions = await SessionsCache.get(user.id);
        if (cachedSuggestions) {
            Logger.debug(`engine.js\tReturned cached suggestions {${user.id}}`);
            return await loadUsers(cachedSuggestions);
        }

        let session = await UserSessionModel.findOne({user_id: user.id});
        if (!session) {
            session = new UserSessionModel({user_id: user.id});
        }

        let suggestedUsers;
        if (areSuggestionsExpired(session)) {
            const dbSuggestions = await refreshSuggestions(user, session);
            session.setSuggestions(dbSuggestions.map((user) => user._id));
            suggestedUsers = dbSuggestions.map((dbSuggestion) => new UserResponse(dbSuggestion));
        } else {
            suggestedUsers = await loadUsers(session.getSuggestions());
        }

        await SessionsCache.set(user.id, session.getSuggestions());
        Logger.debug(`engine.js\tCached suggestions {${user.id}}`);
        return suggestedUsers;
    },
};

module.exports = self;
