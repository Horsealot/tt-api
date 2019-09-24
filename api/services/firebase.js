const admin = require('firebase-admin');
const {AuthError} = require('./../errors');
const Logger = require('./../utils/logger');

let serviceAccount = require('./../../private_config/triktrak-150e7-firebase-adminsdk-6lbpy-633239f6a5');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://triktrak-150e7.firebaseio.com"
});


const self = {
    getUserPhone: async (uid, token) => {
        try {
            Logger.debug(`firebase.js\tStart get user phone`);
            const firebaseUser = await admin.auth().getUser(uid);
            const decodedIdToken = await admin.auth().verifyIdToken(token);
            if (decodedIdToken.uid !== uid) {
                Logger.error(`firebase.js\tUnauthorized access, could be an attempt to steal an account. Sender firebase uid : {${decodedIdToken.uid}}`);
                throw new AuthError({message: 'Unauthorized access'});
            }
            return firebaseUser.phoneNumber;
        } catch (err) {
            Logger.error(`firebase.js\tError while getting user phone {${err.message}}`);
            throw new AuthError(err.message);
        }
    }
};

module.exports = self;
