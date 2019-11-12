const Logger = require('@logger')('consumeUserPick.bv.js');

const self = {
    consume: async (user, userSession) => {
        if (!userSession.favorite_picked) {
            userSession.favorite_picked++;
            await userSession.save();
            Logger.info(`User {${user.id}} picked his favorite for the session {${userSession.id}}`);
        } else if (userSession.extra_selections > 0) {
            userSession.extra_selections--;
            await userSession.save();
            Logger.info(`User {${user.id}} used a session extra favorite for the session {${userSession.id}}`);
        } else if (user.extra_selections > 0) {
            user.extra_selections--;
            await user.save();
            Logger.info(`User {${user.id}} used an extra favorite for the session {${userSession.id}}`);
        }
    },
};

module.exports = self;
