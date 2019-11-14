const getActiveConnectionBehavior = require('@api/behaviors/connections/getActiveConnection.bv');

module.exports = {
    loadConnection: async (req, res, next) => {
        let connection = await getActiveConnectionBehavior.get(req.params.id, req.user._id);
        if (!connection) return res.sendStatus(404);
        req.connection = connection;
        next();
    },
};
