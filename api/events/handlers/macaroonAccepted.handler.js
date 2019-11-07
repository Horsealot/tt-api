const acceptMacaroon = require('@api/behaviors/acceptMacaroon.bv');

module.exports = {
    handle: async (sessionId, from, to) => {
        await acceptMacaroon.acceptForUserId(sessionId, from, to);
    }
};
