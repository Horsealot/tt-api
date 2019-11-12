const acceptMacaroon = require('@api/behaviors/acceptMacaroon.bv');
const gamingTypes = require('@models/types/gaming');
const updateUserAndSessionGamingCountBehavior = require('@api/behaviors/updateUserAndSessionGamingCount.bv');

module.exports = {
    handle: async (sessionId, from, to) => {
        await acceptMacaroon.acceptForUserId(sessionId, from, to);
        await updateUserAndSessionGamingCountBehavior.increment(from, gamingTypes.MACAROONS_ACCEPTED, sessionId, gamingTypes.MACAROONS_ACCEPTED);
    }
};
