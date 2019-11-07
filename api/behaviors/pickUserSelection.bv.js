const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('pickUserSelection.bv.js');
const connectionStatus = require('@models/types/connectionStatus');
const connectionEvent = require('@models/types/connectionEvent');

const {UnauthorizedError} = require('@api/errors');

const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const self = {
    /**
     *
     * @param session
     * @param userId
     * @param pickedUserId
     * @return {Promise<void>}
     */
    pick: async (session, userId, pickedUserId) => {
        const userSession = await UserSessionModel.findOne({user_id: userId, session_id: session._id});
        if (!userSession) {
            throw new UnauthorizedError('User did not participate to the session');
        }
        if (userSession.favoritePicked) {
            throw new UnauthorizedError('User already picked his favorite');
        }

        const connection = await ConnectionModel.findOne({
            '$and': [{'members': userId}, {'members': pickedUserId}],
            'session_id': session._id
        });
        if (!connection) throw new UnauthorizedError('Users are not connected');

        // If status is already as favorite, it means the pickedUser already pick this user as his favorite
        const isMutual = connection.status === connectionStatus.FAVORITE;
        connection.status = connectionStatus.FAVORITE;
        connection.addHistory(connectionEvent.PICK_AS_FAVORITE, userId, new Date());
        await connection.save();
        userSession.favoritePicked = true;
        userSession.nbOfFavorites++;
        await userSession.save();
        EventEmitter.emit(eventTypes.SELECTION_PICKED, {from: userId, to: pickedUserId, isMutual});
        Logger.info(`User {${userId}} picked {${pickedUserId}} as his favorite for the session {${session.id}}`);
        return connection;
    },
};

module.exports = self;
