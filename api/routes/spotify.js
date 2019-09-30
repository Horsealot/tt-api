const auth = require('@api/utils/auth');
const validator = require('@api/utils/validator');

const spotifyLinkValidator = require('@models/validators/spotify/link.validator');

const SpotifyController = require('@api/controllers/spotify.ctrl');
const ProfileResponse = require('@models/responses/profile.response');

const {userPictureUploader} = require('@api/services/userPicture');

module.exports = (router) => {
    router.post('/spotify/authorize', auth.required, validator(spotifyLinkValidator, 'body'), auth.loadUser, async (req, res) => {
        try {
            const user = await SpotifyController.linkUser(req.user, req.body.code);
            res.send(new ProfileResponse(user));
        } catch (e) {
            res.status(503).send({error: e.message});
        }
    });
};
