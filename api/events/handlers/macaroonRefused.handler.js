const refuseMacaroon = require('@api/behaviors/refuseMacaroon.bv');

module.exports = {
    handle: async (sessionId, from, to) => {
        await refuseMacaroon.refuseForUserId(sessionId, from, to);
    }
};
