const auth = require('@api/utils/auth');
const messengerMiddleware = require('@api/middlewares/messenger.middleware');
const MessengerController = require('@api/controllers/messenger.ctrl');
const messageValidator = require('@models/validators/connections/message.validator');
const answerValidator = require('@models/validators/gaming/answer.validator');
const validator = require('@api/utils/validator');
const errorHandler = require('@api/utils/errorHandler');

module.exports = (router) => {
    router.get('/connections/:id', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.getConnection);
    router.post('/connections/:id', validator(messageValidator, 'body'), auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.postMessage);
    router.post('/connections/:id/read', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.markAsRead);
    router.get('/connections/:id/pages', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.getConnectionPage);
    router.get('/connections/:id/games', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.getShuffleGame);
    router.post('/connections/:id/games', auth.required, auth.loadUser, messengerMiddleware.loadConnection, MessengerController.postShuffleGame);
    router.post('/connections/:id/games/:messageId', validator(answerValidator, 'body'), auth.required, auth.loadUser, messengerMiddleware.loadConnection, errorHandler(MessengerController.answerShuffleGame));
};
