const Logger = require('@logger')('lairs.js');
const rp = require('request-promise');

const host = process.env.TT_LAIRS_HOST;
if (!host) throw new Error("Missing env variable TT_LAIRS_HOST");

module.exports = {
    /**
     * Post user lairs and get details about it
     * @param user
     * @param lairs
     * @returns {Promise<T | never>}
     */
    postUserLairs: async (user, lairs) => {
        const options = {
            uri: host + '/api/users',
            body: lairs,
            auth: {
                'bearer': user.generateInternalJWT()
            },
            json: true // Automatically stringifies the body to JSON
        };

        try {
            return await rp.post(options);
        } catch (err) {
            Logger.error(`Error while requesting post user {${err.status}%${err.message}}`);
            throw err;
        }
    },
    getUserLairs: async (user) => {
        const options = {
            uri: host + '/api/users',
            auth: {
                'bearer': user.generateInternalJWT()
            },
            json: true // Automatically stringifies the body to JSON
        };

        try {
            return await rp.get(options);
        } catch (err) {
            Logger.error(`Error while requesting get user {${err.status}%${err.message}}`);
            throw err;
        }
    },
};
