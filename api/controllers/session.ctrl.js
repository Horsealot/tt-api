const Logger = require('@logger');
const SuggestionEngine = require('@api/suggestions/engine');

const self = {
    getSuggestions: async (req, res) => {
        const {user} = req;
        try {
            Logger.debug(`session.ctrl.js\tUser ${req.user._id} requested his suggestions`);
            const userSuggestions = await SuggestionEngine.getUserSuggestions(user);
            if (userSuggestions.length < 10) {
                // Trigger session refresh
            }
            res.json(userSuggestions);
        } catch (e) {
            console.log(e);
            Logger.error(`session.ctrl.js\tGet suggestions error: {${e.message}}`);
            res.sendStatus(503);
        }
    }
};

module.exports = self;
