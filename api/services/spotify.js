const Logger = require('@logger')('spotify.js');
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
                Logger.error(`Error while requesting link user {${err.status}%${err.message}}`);
                throw err;
            });
    },
    delinkUser: (userId) => {
        const options = {
            method: 'DELETE',
            uri: host + '/api/users/' + userId,
            json: true // Automatically stringifies the body to JSON
        };

        return rp(options)
            .then(function (parsedBody) {
                return parsedBody;
            })
            .catch(function (err) {
                Logger.error(`Error while requesting de-link user {${err.status}%${err.message}}`);
                throw err;
            });
    },
};
