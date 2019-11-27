const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('getUserActiveInvites.bv.js');
const profileLoader = require('@api/loaders/profile');
const macaroonStatus = require('@models/schemas/session/macaroonStatus');

const self = {
    /**
     * Get user active invites. If lastActiveAt is provided, we return only the invites sent after the lastActiveAt
     * @return {Promise<[ConnectionModel]>}
     * @param nextOrCurrentSession
     * @param user
     * @param lastActiveAt
     */
    get: async (nextOrCurrentSession, user, lastActiveAt) => {
        if (!nextOrCurrentSession.isActive()) return [];
        const userSession = await UserSessionModel.findOne({
            user_id: user._id,
            session_id: nextOrCurrentSession._id
        });
        if (!userSession) return [];
        const invitedUserIds = userSession.macaroons
            .filter((macaroon) => macaroon.status === macaroonStatus.NEW &&
                (lastActiveAt === null || macaroon.sent_at >= lastActiveAt))
            .map((macaroon) => macaroon.user_id);
        return await profileLoader.getList(invitedUserIds);
    },
};

module.exports = self;
