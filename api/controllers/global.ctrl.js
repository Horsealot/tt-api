const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const SessionModel = mongoose.model('Session');
const macaroonStatus = require('@models/schemas/session/macaroonStatus');
const profileLoader = require('@api/loaders/profile');

const self = {
    getUserUpdates: async (req, res) => {
        const {query: {last_update_date = null}} = req;
        let userUpdates = {
            favorites: [],
            expired: [],
            invites: [],
            announcements: [],
        };
        const nextOrCurrentSession = await SessionModel.findCurrentDisplayed();

        Promise.all([
            new Promise(async (resolve) => {
                if (!nextOrCurrentSession.isActive()) return resolve();
                const userSession = await UserSessionModel.findOne({
                    user_id: req.user._id,
                    session_id: nextOrCurrentSession._id
                });
                if (!userSession) return resolve();
                const invitedUserIds = userSession.macaroons
                    .filter((macaroon) => macaroon.status === macaroonStatus.NEW &&
                        (last_update_date === null || macaroon.sent_at >= new Date(last_update_date)))
                    .map((macaroon) => macaroon.user_id);
                userUpdates.invites = await profileLoader.getList(invitedUserIds);
                resolve();
            })
        ]).then(() => {
            res.json(userUpdates);
        });
    },
};

module.exports = self;
