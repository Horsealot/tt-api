const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('updateUserAndSessionGamingCount.bv.js');

const incUserGamingData = async (userId, userField) => {
    const user = await UserModel.findOne({_id: userId});
    if (user && user.gaming[userField] !== undefined) {
        user.gaming[userField]++;
        await user.save();
    }
};

const incUserSessionData = async (userId, sessionId, sessionField) => {
    const userSession = await UserSessionModel.findOne({user_id: userId, session_id: sessionId});
    if (userSession && userSession[sessionField] !== undefined) {
        userSession[sessionField]++;
        await userSession.save();
    }
};

const self = {
    increment: async (userId, userField, sessionId, sessionField) => {
        return Promise.all([
            incUserGamingData(userId, userField),
            incUserSessionData(userId, sessionId, sessionField)
        ]);
    },
};

module.exports = self;
