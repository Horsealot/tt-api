const admin = require('firebase-admin');
const {AuthError} = require('@api/errors');
const Logger = require('@logger')('firebase.js');

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
if (!adminConfig) throw new Error("Missing env variable FIREBASE_CONFIG");

admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: "https://triktrak-150e7.firebaseio.com"
});


const self = {
    getUserPhone: async (uid, token) => {
        try {
            Logger.debug(`Start get user phone`);
            const firebaseUser = await admin.auth().getUser(uid);
            const decodedIdToken = await admin.auth().verifyIdToken(token);
            if (decodedIdToken.uid !== uid) {
                Logger.error(`Unauthorized access, could be an attempt to steal an account. Sender firebase uid : {${decodedIdToken.uid}}`);
                throw new AuthError({message: 'Unauthorized access'});
            }
            return firebaseUser.phoneNumber;
        } catch (err) {
            Logger.error(`Error while getting user phone {${err.message}}`);
            throw new AuthError(err.message);
        }
    }
};

module.exports = self;
