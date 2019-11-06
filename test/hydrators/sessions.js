const moment = require('moment');
const mongoose = require('mongoose');
require('./../../api/models');
const SessionModel = mongoose.model('Session');

module.exports = {
    inactiveSession: () => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const inTwoDays = new Date();
        inTwoDays.setDate(inTwoDays.getDate() + 2);
        return SessionModel.deleteMany({}).then(() => {
            const inactivePastSession = new SessionModel({
                start_at: twoDaysAgo,
                end_at: yesterday,
            });
            return inactivePastSession.save();
        }).then(() => {
            const inactiveFutureSession = new SessionModel({
                start_at: tomorrow,
                end_at: inTwoDays,
            });
            return inactiveFutureSession.save();
        });
    },
    activeSession: () => {
        return SessionModel.deleteMany({}).then(() => {
            const activeSession = new SessionModel({
                start_at: moment().subtract(1, 'hours'),
                end_at: moment().add(1, 'hours'),
            });
            return activeSession.save();
        });
    },
    clean: () => {
        return SessionModel.deleteMany({})
    }
};
