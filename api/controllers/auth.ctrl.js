const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const Logger = require('./../utils/logger');

const FirebaseService = require('./../services/firebase');
const NexmoService = require('./../services/nexmo');

const self = {
    authFirebase: async (uid, accessToken) => {
        try {
            const userPhone = await FirebaseService.getUserPhone(uid, accessToken);
            return self.loginOrSignupByPhone(userPhone);
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    },
    loginOrSignupByPhone: async (phone) => {
        try {
            var user = await UserModel.findOne({phone});
            if (!user) {
                user = new UserModel({phone});
                Logger.debug(`auth.ctrl.js\t User {${phone}} created`);
            }
            user.last_login = new Date();
            Logger.debug(`auth.ctrl.js\t User {${phone}} updated`);
            return await user.save();
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    },
    requestAuthCode: async (phone) => {
        try {
            const requestId = await NexmoService.requestAuthCode(phone);
            Logger.debug(`auth.ctrl.js\tAuth code requested {${phone}}`);
            return requestId;
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    },
    authByPhoneCode: async (requestId, code) => {
        try {
            const userPhone = await NexmoService.authenticate(requestId, code);
            Logger.debug(`auth.ctrl.js\t New Phone authentication {${userPhone}}`);
            return await self.loginOrSignupByPhone(userPhone);
        } catch (e) {
            Logger.error(e);
            throw e;
        }
    }
};

module.exports = self;
