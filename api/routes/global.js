const auth = require('@api/utils/auth');
const GlobalController = require('@api/controllers/global.ctrl');
const updatesValidator = require('@models/validators/updates.validator');
const validator = require('@api/utils/validator');

module.exports = (router) => {
    router.get('/updates', auth.required, auth.loadUser, validator(updatesValidator, 'query'), GlobalController.getUserUpdates);
};
