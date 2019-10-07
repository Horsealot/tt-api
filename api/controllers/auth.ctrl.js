const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const Logger = require('@logger');

const passport = require('passport');

const FirebaseService = require('@api/services/firebase');
const NexmoService = require('@api/services/nexmo');
const FacebookUtils = require('@api/utils/facebook');

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
    authFacebook: async (req, res) => {
        const id = req.payload ? req.payload.id : null;
        let user;
        if (req.payload && req.payload.id) {
            user = await UserModel.findOne({_id: id});
        }
        passport.authenticate('facebook-token', {session: false}, async (err, profile, info) => {
            if (err) {
                if (err.oauthError) {
                    let oauthError = JSON.parse(err.oauthError.data);
                    return res.status(503).send(oauthError.error.message);
                }
                return res.status(503).send(err);
            } else {
                let existingFbUser = await UserModel.findOne({'facebookProvider.id': profile.id, _id: {'$ne': id}});
                if (user && existingFbUser && existingFbUser.id !== user.id) {
                    return res.status(409).send({error: 'FB account already linked'});
                }

                const fbMail = FacebookUtils.extractEmail(profile);
                let existingMailUser = await UserModel.findOne({'email': fbMail});

                if (user) {
                    if (existingMailUser && existingMailUser.id !== user.id) {
                        existingMailUser.duplicate_of = user._id;
                        await existingMailUser.save();
                        profile = FacebookUtils.eraseEmail(profile);
                    }
                } else {
                    if (existingFbUser) {
                        user = existingFbUser;
                    } else if (existingMailUser) {
                        user = existingMailUser;
                    } else {
                        user = new UserModel();
                    }
                }
                user.setFromFacebook(profile);
                await user.save();
                res.send(user);
            }
        })(req, res)
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
