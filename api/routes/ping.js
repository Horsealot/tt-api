const auth = require('@api/utils/auth');
const PingController = require('@api/controllers/ping.ctrl');
const validator = require('@api/utils/validator');
const locationValidator = require('@models/validators/users/location.validator');

module.exports = (router) => {
    router.post('/ping', auth.required, auth.loadUser, validator(locationValidator, 'body'), PingController.ping);
};
