const Logger = require('@logger');

const self = {
    ping: async (req, res) => {
        try {
            Logger.debug(`ping.ctrl.js\tUser ${req.user._id} updated his location`);
            req.user.setCoordinates(req.body.lng, req.body.lat);
            await req.user.save();
            res.sendStatus(200);
        } catch (e) {
            Logger.error(`ping.ctrl.js\tping error: {${e.message}}`);
            res.sendStatus(503);
        }
    }
};

module.exports = self;
