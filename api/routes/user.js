const auth = require('@api/utils/auth');

const sessionManager = require('@api/middlewares/session.middleware');
const UserController = require('@api/controllers/user.ctrl');

module.exports = (router) => {
    router.post('/users/:userId/invite', auth.required, sessionManager.isInSession, UserController.sendMacaroon);
};
