const auth = require('@api/utils/auth');
const validator = require('@api/utils/validator');

const filtersValidator = require('@models/validators/users/filters.validator');
const jobsValidator = require('@models/validators/users/jobs.validator');

const ProfileController = require('@api/controllers/profile.ctrl');

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

    router.post('/profile/jobs', auth.required, auth.loadUser, validator(jobsValidator, 'body'), async (req, res) => {
        try {
            const user = await ProfileController.updateUserJobs(req.user, req.body);
            res.send(user);
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    });
};
