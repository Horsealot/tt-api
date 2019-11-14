const auth = require('@api/utils/auth');
const messengerMiddleware = require('@api/middlewares/messenger.middleware');
const MessengerController = require('@api/controllers/messenger.ctrl');
const messageValidator = require('@models/validators/connections/message.validator');
const validator = require('@api/utils/validator');

module.exports = (router) => {
    router.get('/conversations/:id', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.getConversation);
    router.post('/conversations/:id', validator(messageValidator, 'body'), auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.postMessage);
    router.get('/conversations/:id/pages', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.getConversationPage);
};
