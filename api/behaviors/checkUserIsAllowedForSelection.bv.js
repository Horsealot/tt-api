const self = {
    /**
     * Has user remaining selection available
     * @param user
     * @param userSession
     * @return {boolean}
     */
    isAllowed: (user, userSession) => {
        return userSession.favorite_picked === 0 || user.extra_selections > 0 || userSession.extra_selections > 0;
    },
};

module.exports = self;
