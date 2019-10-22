const profile = require('./profile');
const auth = require('./auth');
const spotify = require('./spotify');
const ping = require('./ping');

module.exports = (router) => {
    profile(router);
    auth(router);
    spotify(router);
    ping(router);
};
