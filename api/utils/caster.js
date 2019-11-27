const mongoose = require('mongoose');

const self = {
    toObjectId: (id) => {
        if (typeof id === 'string') return mongoose.Types.ObjectId(id);
        return id;
    },
    toString: (data) => {
        if (data && typeof data !== 'string' && typeof data.toString === 'function') return data.toString();
        return data;
    },
    compareObjectId(id1, id2) {
        return self.toString(id1) === self.toString(id2);
    }
};

module.exports = self;
