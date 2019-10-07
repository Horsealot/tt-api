module.exports = {
    extractEmail: (profile) => {
        if (profile.emails
            && profile.emails.length
            && profile.emails[0].value
        ) {
            return profile.emails[0].value;
        }
        return null;
    },
    eraseEmail: (profile) => {
        profile.emails = undefined;
        return profile;
    }
};
