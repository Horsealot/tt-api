const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const UserSessionModel = mongoose.model('UserSession');
const Logger = require('@logger')('pickUserSelection.bv.js');
const connectionStatus = require('@models/types/connectionStatus');
const connectionEvent = require('@models/types/connectionEvent');

const checkUserIsAllowedForSelectionBehavior = require('./checkUserIsAllowedForSelection.bv');
const consumeUserPickBehavior = require('./consumeUserPick.bv');

const {UnauthorizedError} = require('@api/errors');

const EventEmitter = require('@emitter');
const eventTypes = require('@events');

const self = {
    /**
     *
     * @param session
     * @param user
     * @param pickedUserId
     * @return {Promise<void>}
     */
    pick: async (session, user, pickedUserId) => {
        const userSession = await UserSessionModel.findOne({user_id: user._id, session_id: session._id});
        if (!userSession) {
            throw new UnauthorizedError('User did not participate to the session');
        }
        if (!checkUserIsAllowedForSelectionBehavior.isAllowed(user, userSession)) {
            throw new UnauthorizedError('User already picked his favorite');
        }

        const connection = await ConnectionModel.findOne({
            '$and': [{'members': user._id}, {'members': pickedUserId}],
            'session_id': session._id
        });
        if (!connection) throw new UnauthorizedError('Users are not connected');

        // If status is already as favorite, it means the pickedUser already pick this user as his favorite
        const isMutual = connection.status === connectionStatus.FAVORITE;
        connection.status = connectionStatus.FAVORITE;
        connection.addHistory(connectionEvent.PICK_AS_FAVORITE, user._id, new Date());
        await connection.save();
        await consumeUserPickBehavior.consume(user, userSession);
        EventEmitter.emit(eventTypes.SELECTION_PICKED, {from: user.id, to: pickedUserId, isMutual});
        Logger.info(`User {${user.id}} picked {${pickedUserId}} as his favorite for the session {${session.id}}`);
        return connection;
    },
};

module.exports = self;
