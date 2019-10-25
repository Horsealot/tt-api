const auth = require('@api/utils/auth');
const SessionController = require('@api/controllers/session.ctrl');
const sessionManager = require('@api/middlewares/session.middleware');

module.exports = (router) => {
    router.get('/session', auth.required, auth.loadUser, sessionManager.isInSession, SessionController.getSuggestions);
};
