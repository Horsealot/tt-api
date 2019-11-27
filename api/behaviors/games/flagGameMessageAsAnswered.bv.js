const mongoose = require('mongoose');
const MessageModel = mongoose.model('Message');
const Logger = require('@logger')('flagGameMessageAsAnswered.bv.js');
const caster = require('@api/utils/caster');


const self = {
    flagConnectionMessage: async (loggedUser, connection, gameMessage) => {
        const inConnectionMessage = connection.messages.find((connectionMessage) => caster.compareObjectId(connectionMessage._id, gameMessage._id));
        if (inConnectionMessage && !inConnectionMessage.content.answered_by.find((id) => caster.compareObjectId(id, loggedUser._id))) {
            inConnectionMessage.content.answered_by.push(loggedUser._id);
            inConnectionMessage.markModified('content');
            await connection.save();
        }
    },
    flagMessage: async (loggedUser, gameMessage) => {
        await MessageModel.updateOne(
            {_id: gameMessage._id},
            {$addToSet: {'content.answered_by': loggedUser._id}}
        );
    },
    flag: async (loggedUser, connection, gameMessage) => {
        await Promise.all([
            self.flagConnectionMessage(loggedUser, connection, gameMessage),
            self.flagMessage(loggedUser, gameMessage),
        ]);
        Logger.debug(`{${loggedUser._id}} flagged as having answered the {${gameMessage._id}} game`);
    },
};

module.exports = self;
