const UsersHydrator = require('./users');
const SessionsHydrator = require('./sessions');
const ConnectionsHydrator = require('./connections');
const UserSessionsHydrator = require('./userSessions');
const MessagesHydrator = require('./messages');

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
            .then(() => MessagesHydrator.clean())
            .then(() => UserSessionsHydrator.clean());
    }
};
