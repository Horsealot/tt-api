const refuseMacaroon = require('@api/behaviors/refuseMacaroon.bv');
const gamingTypes = require('@models/types/gaming');
const updateUserAndSessionGamingCountBehavior = require('@api/behaviors/updateUserAndSessionGamingCount.bv');

module.exports = {
    handle: async (sessionId, from, to) => {
        await refuseMacaroon.refuseForUserId(sessionId, from, to);
        await updateUserAndSessionGamingCountBehavior.increment(from, gamingTypes.MACAROONS_REFUSED, sessionId, gamingTypes.MACAROONS_REFUSED);
    }
};
