const Logger = require('@logger')('ping.ctrl.js');

const self = {
    ping: async (req, res) => {
        try {
            Logger.debug(`User ${req.user._id} updated his location`);
            req.user.setCoordinates(req.body.lng, req.body.lat);
            await req.user.save();
            res.sendStatus(200);
        } catch (e) {
            Logger.error(`ping error: {${e.message}}`);
            res.sendStatus(503);
        }
    }
};

module.exports = self;
