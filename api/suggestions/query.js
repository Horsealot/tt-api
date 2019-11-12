const caster = require('@api/utils/caster');

/**
 * Filter my session by my gender preference
 * @param user
 * @return {*}
 */
const getGenderFilter = (user) => {
    if (user.filters.gender === 'B') return {};
    return {'gender': user.filters.gender};
};

/**
 * Filter my session by their gender preference
 * @param user
 * @return {*}
 */
const getGenderPreferenceFilter = (user) => {
    return {
        'filters.gender': {
            '$in': ['B', user.gender]
        }
    };
};

class Query {
    constructor(user, blacklist) {
        this.user = user;
        this.blacklist = blacklist;
    }

    generate() {
        return [{
            '$geoNear': {
                'near': {'type': "Point", 'coordinates': this.user.location.coordinates},
                'distanceField': "dist.calculated",
                'maxDistance': this.user.filters.max_distance * 1000,
                'query': {
                    '_id': {"$nin": this.blacklist.map(caster.toObjectId)},
                    ...getGenderFilter(this.user),
                    ...getGenderPreferenceFilter(this.user),
                },
                'spherical': true
            }
        }];
    }
}

module.exports = Query;
