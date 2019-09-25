const converter = require('@models/converters');

module.exports = {
    updateUserFilters: async (user, filters) => {
        user.filters = filters;
        return await user.save();
    },
    updateUserJobs: async (user, jobs) => {
        user.jobs = jobs;
        return await user.save();
    },
    getProfileNomenclature: () => {
        return converter.getProfileNomenclature();
    }
};
