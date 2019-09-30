const Logger = require('@api/utils/logger');
const rp = require('request-promise');

const host = process.env.TT_SPOTIFY_HOST;
if (!host) throw new Error("Missing env variable TT_SPOTIFY_HOST");

module.exports = {
    linkUser: (userId, code) => {
        const options = {
            method: 'POST',
            uri: host + '/api/users',
            body: {
                user_id: userId,
                authorization_code: code
            },
            json: true // Automatically stringifies the body to JSON
        };

        return rp(options)
            .then(function (parsedBody) {
                return parsedBody;
            })
            .catch(function (err) {
                Logger.error(`spotify.js\tError while requesting link user {${err.status}%${err.message}}`);
                throw err;
            });
    },
};
