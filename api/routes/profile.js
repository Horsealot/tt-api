const auth = require('./../utils/auth');
const validator = require('./../utils/validator');

const filtersValidator = require('./../models/validators/users/filters.validator');

const ProfileController = require('../controllers/profile.ctrl');

module.exports = (router) => {

    router.get('/profile/nomenclature', auth.required, (req, res) => {
        res.send(ProfileController.getProfileNomenclature());
    });

    router.post('/profile/filters', auth.required, auth.loadUser, validator(filtersValidator, 'body'), async (req, res) => {
        try {
            const user = await ProfileController.updateUserFilters(req.user, req.body);
            res.send(user);
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    });
};
