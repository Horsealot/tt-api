const profile = require('./profile');
const auth = require('./auth');
const spotify = require('./spotify');
const ping = require('./ping');
const session = require('./session');
const user = require('./user');
const global = require('./global');
const messenger = require('./messenger');

module.exports = (router) => {
    profile(router);
    auth(router);
    spotify(router);
    ping(router);
    session(router);
    global(router);
    user(router);
    messenger(router);
};
