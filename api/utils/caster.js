const mongoose = require('mongoose');

module.exports = {
    toObjectId: (id) => {
        if (typeof id === 'string') return mongoose.Types.ObjectId(id);
        return id;
    },
    toString: (data) => {
        if (data && typeof data !== 'string' && typeof data.toString === 'function') return data.toString();
        return data;
    },
};
