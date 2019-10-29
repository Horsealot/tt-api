const UsersHydrator = require('./users');
const SessionsHydrator = require('./sessions');

module.exports = {
    init: () => {
        return UsersHydrator.init();
    },
    initInactiveSession: () => {
        return SessionsHydrator.inactiveSession();
    },
    initActiveSession: () => {
        return SessionsHydrator.activeSession();
    }
};
