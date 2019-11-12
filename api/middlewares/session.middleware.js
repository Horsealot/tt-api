const mongoose = require('mongoose');
const SessionModel = mongoose.model('Session');

module.exports = {
    isInSession: async (req, res, next) => {
        const activeSession = await SessionModel.findActive();
        if (!activeSession) {
            res.status(450).send({error: 'Unauthorized, retry during a session'});
        } else {
            req.sessionId = activeSession.id;
            next();
        }
    },
};
