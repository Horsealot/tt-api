const auth = require('@api/utils/auth');
const validator = require('@api/utils/validator');

const filtersValidator = require('@models/validators/users/filters.validator');
const jobsValidator = require('@models/validators/users/jobs.validator');
const studiesValidator = require('@models/validators/users/studies.validator');
const ProfileController = require('@api/controllers/profile.ctrl');
const ProfileResponse = require('@models/responses/profile.response');

module.exports = (router) => {

    router.get('/profile', auth.required, auth.loadUser, (req, res) => {
        res.send(new ProfileResponse(ProfileController.getProfile(req.user)));
    });

    router.get('/profile/nomenclature', auth.required, (req, res) => {
        res.send(ProfileController.getProfileNomenclature());
    });

    router.put('/profile/filters', auth.required, auth.loadUser, validator(filtersValidator, 'body'), async (req, res) => {
        try {
            const user = await ProfileController.updateUserFilters(req.user, req.body);
            res.send(new ProfileResponse(user));
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    });

    router.put('/profile/jobs', auth.required, auth.loadUser, validator(jobsValidator, 'body'), async (req, res) => {
        try {
            const user = await ProfileController.updateUserJobs(req.user, req.body);
            res.send(new ProfileResponse(user));
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    });

    router.put('/profile/studies', auth.required, auth.loadUser, validator(studiesValidator, 'body'), async (req, res) => {
        try {
            const user = await ProfileController.updateUserStudies(req.user, req.body);
            res.send(new ProfileResponse(user));
        } catch (e) {
            console.log(e);
            res.status(500).send({error: e.message});
        }
    });
};
