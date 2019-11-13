const Logger = require('@logger')('countUserUnreadMessages.bv.js');
const caster = require('@api/utils/caster');

const self = {
    count: (user, connection) => {
        if (!connection.readers || !connection.readers[user.id]) {
            return connection.nb_of_messages;
        }
        let readedMessageReached = false;
        const result = connection.messages.reduceRight((acc, cur) => {
            if (caster.toString(cur.id) === caster.toString(connection.readers[user.id].last_read)) readedMessageReached = true;
            return acc + (!readedMessageReached ? 1 : 0);
        }, 0);
        return result;
    },
};

module.exports = self;
