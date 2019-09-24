const profile = require('./profile');
const auth = require('./auth');

module.exports = (router) => {
    profile(router);
    auth(router);
};
