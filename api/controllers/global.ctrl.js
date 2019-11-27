const mongoose = require('mongoose');
const SessionModel = mongoose.model('Session');
const getUserActiveConnectionsBehavior = require('@api/behaviors/getUserActiveConnections.bv');
const getUserActiveInvitesBehavior = require('@api/behaviors/getUserActiveInvites.bv');
const ConnectionResponse = require('@models/responses/connection.response');

const self = {
    getUserUpdates: async (req, res) => {
        const {query: {last_update_date = null}} = req;
        let userUpdates = {
            connections: [],
            expired: [],
            invites: [],
            announcements: [],
        };
        const nextOrCurrentSession = await SessionModel.findCurrentDisplayed();

        await Promise.all([
            new Promise(async (resolve) => {
                userUpdates.invites = await getUserActiveInvitesBehavior.get(nextOrCurrentSession, req.user, last_update_date);
                resolve();
            }),
            new Promise(async (resolve) => {
                userUpdates.connections = (await getUserActiveConnectionsBehavior.get(req.user, last_update_date))
                    .map((connection) => new ConnectionResponse(connection, req.user));
                resolve();
            })
        ]);

        res.json(userUpdates);
    },
};

module.exports = self;
