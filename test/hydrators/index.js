const UsersHydrator = require('./users');
const SessionsHydrator = require('./sessions');
const ConnectionsHydrator = require('./connections');
const UserSessionsHydrator = require('./userSessions');

module.exports = {
    init: () => {
        return UsersHydrator.init();
    },
    initInactiveSession: () => {
        return SessionsHydrator.inactiveSession();
    },
    initActiveSession: () => {
        return SessionsHydrator.activeSession();
    },
    clean: () => {
        return UsersHydrator.clean()
            .then(() => SessionsHydrator.clean())
            .then(() => ConnectionsHydrator.clean())
            .then(() => UserSessionsHydrator.clean());
    }
};
