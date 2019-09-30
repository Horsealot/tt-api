const profile = require('./profile');
const auth = require('./auth');
const spotify = require('./spotify');

module.exports = (router) => {
    profile(router);
    auth(router);
    spotify(router);
};
