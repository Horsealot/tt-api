const passport = require('passport');

const AuthController = require('../controllers/auth.ctrl');

module.exports = (router) => {

    /**
     * Authenticate using email/password
     */
    router.post('/auth', (req, res, next) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }
        return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
            if (err) return next(err);

            if (passportUser) {
                const user = passportUser;
                user.token = passportUser.generateJWT();
                return res.json({user: user.toAuthJSON()});
            }

            return res.sendStatus(401).info;
        })(req, res, next);
    });

    /**
     * Authenticate using Firebase mobile auth
     */
    router.post('/auth/firebase', (req, res) => {
        const {uid, accessToken} = req.body;
        if (!accessToken || !uid) {
            return res.sendStatus(400);
        }
        AuthController.authFirebase(uid, accessToken).then((user) => {
            res.send({user: user.toAuthJSON()});
        }).catch(() => {
            res.sendStatus(401);
        })
    });

    /**
     * Authenticate using Facebook account
     */
    router.post('/auth/facebook', (req, res) => {
        res.sendStatus(200);
    });

    /**
     * Get phone validation code
     */
    router.post('/auth/phone', (req, res) => {
        const {phone} = req.body;
        if (!phone) {
            return res.sendStatus(400);
        }
        AuthController.requestAuthCode(phone).then((result) => {
            res.send({request_id: result});
        }).catch((err) => {
            res.sendStatus(401);
        });
    });

    /**
     * Post phone validation code
     */
    router.post('/auth/phone/validate', (req, res) => {
        const {requestId, code} = req.body;
        if (!requestId || !code) {
            return res.sendStatus(400);
        }
        AuthController.authByPhoneCode(requestId, code).then((user) => {
            res.send({user: user.toAuthJSON()});
        }).catch((err) => {
            res.sendStatus(401);
        });
    });
};
