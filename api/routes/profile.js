const auth = require('./../utils/auth');

const ProfileController = require('../controllers/profile.ctrl');

module.exports = (router) => {

    /**
     * get my user
     */
    router.get('/me', auth.required, auth.loadUser, (req, res) => {
        res.sendStatus(200);
    });

    /**
     * Get profile nomenclature
     */
    router.get('/profile/nomenclature', auth.required, (req, res) => {
        res.send(ProfileController.getProfileNomenclature());
    });
};