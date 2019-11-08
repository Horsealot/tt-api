const auth = require('@api/utils/auth');
const SessionController = require('@api/controllers/session.ctrl');
const sessionManager = require('@api/middlewares/session.middleware');
const pathUserIdValidator = require('@models/validators/pathUserId.validator');
const validator = require('@api/utils/validator');

module.exports = (router) => {
    router.get('/session', auth.optional, SessionController.getSessionStatus);
    router.get('/session/favorites', auth.required, auth.loadUser, SessionController.getAvailableFavorites);
    router.post('/session/favorites/:userId', auth.required, auth.loadUser, validator(pathUserIdValidator, 'params'), SessionController.pickFavorite);
    router.get('/session/suggestions', auth.required, auth.loadUser, sessionManager.isInSession, SessionController.getSuggestions);
};
