const auth = require('@api/utils/auth');
const MessengerController = require('@api/controllers/messenger.ctrl');
const updatesValidator = require('@models/validators/updates.validator');
const validator = require('@api/utils/validator');

module.exports = (router) => {
    router.get('/conversations/:id', auth.required, auth.loadUser, MessengerController.getConversation);
    router.get('/conversations/:id/pages', auth.required, auth.loadUser, MessengerController.getConversationPage);
};
