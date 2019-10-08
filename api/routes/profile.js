const auth = require('@api/utils/auth');
const validator = require('@api/utils/validator');

const Logger = require('@logger');

const filtersValidator = require('@models/validators/users/filters.validator');
const picturePositionValidator = require('@models/validators/users/picturePosition.validator');
const picturesValidator = require('@models/validators/users/pictures.validator');
const jobsValidator = require('@models/validators/users/jobs.validator');
const studiesValidator = require('@models/validators/users/studies.validator');
const notificationsValidator = require('@models/validators/users/notifications.validator');
const lairsValidator = require('@models/validators/users/lairs.validator');
const detailsValidator = require('@models/validators/users/details.validator');

const ProfileController = require('@api/controllers/profile.ctrl');
const ProfileResponse = require('@models/responses/profile.response');

const {userPictureUploader} = require('@api/services/userPicture');
const uploaderMiddleware = userPictureUploader.single('picture');

module.exports = (router) => {

    router.get('/profile', auth.required, auth.loadUser, (req, res) => {
        res.send(new ProfileResponse(ProfileController.getProfile(req.user)));
    });

    router.get('/profile/nomenclature', auth.required, (req, res) => {
        res.send(ProfileController.getProfileNomenclature());
    });

    router.post('/profile/upload', auth.required, auth.loadUser, validator(picturePositionValidator, 'query'), userPictureUploader.single('picture'), (req, res) => {
        uploaderMiddleware(req, res, async function (err) {
            if (err) {
                Logger.error(`profile.js\tError while uploading user picture {${err}}`);
                return res.status(503).send({error: err.message});
            }
            const user = await ProfileController.uploadPicture(req.user, req.file.key, req.query.position);
            res.send(new ProfileResponse(user));
        })
    });

    router.put('/profile/notifications', auth.required, auth.loadUser, validator(notificationsValidator, 'body'), ProfileController.putNotifications);

    router.put('/profile/lairs', auth.required, auth.loadUser, validator(lairsValidator, 'body'), ProfileController.putLairs);

    router.put('/profile/details', auth.required, auth.loadUser, validator(detailsValidator, 'body'), ProfileController.putDetails);

    router.post('/profile/visibility', auth.required, auth.loadUser, ProfileController.reactivateProfile);

    router.delete('/profile/visibility', auth.required, auth.loadUser, ProfileController.deactivateProfile);

    router.put('/profile/pictures', auth.required, auth.loadUser, validator(picturesValidator, 'body'), async (req, res) => {
        const user = await ProfileController.updateUserPictures(req.user, req.body);
        res.send(new ProfileResponse(user));
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
