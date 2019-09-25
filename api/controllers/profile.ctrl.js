const converter = require('@models/converters');

module.exports = {
    getProfile: (loggedInUser) => {
        return loggedInUser;
    },
    updateUserFilters: async (user, filters) => {
        user.filters = filters;
        return await user.save();
    },
    updateUserJobs: async (user, jobs) => {
        user.jobs = jobs;
        return await user.save();
    },
    updateUserStudies: async (user, studies) => {
        user.studies = studies;
        return await user.save();
    },
    getProfileNomenclature: () => {
        return converter.getProfileNomenclature();
    }
};
