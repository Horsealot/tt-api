const converter = require('@models/converters');

class ProfileResponse {
    constructor(user) {
        this.id = user._id;
        this.active = !!user.active;
        this.firstname = user.firstname ? user.firstname : null;
        this.lastname = user.lastname ? user.lastname : null;
        this.phone = user.phone ? user.phone : null;
        this.height = user.height ? user.height : null;
        this.email = user.email ? user.email : null;
        this.bio = user.bio ? user.bio : null;
        this.date_of_birth = user.date_of_birth ? user.date_of_birth : null;
        this.filters = user.filters;
        this.gender = user.gender ? user.gender : null;
        this.physical_activity = user.physical_activity ? converter.getPhysicalActivity(user.physical_activity) : null;
        this.astrological_sign = user.astrological_sign ? user.astrological_sign : null;
        this.alcohol_habits = user.alcohol_habits ? user.alcohol_habits : null;
        this.smoking_habits = user.smoking_habits ? user.smoking_habits : null;
        this.kids_expectation = user.kids_expectation ? user.kids_expectation : null;
        this.religion = user.religion ? user.religion : null;
        this.political_affiliation = user.political_affiliation ? user.political_affiliation : null;
        this.pictures = user.pictures ? user.pictures : [];
        this.jobs = user.jobs ? user.jobs : [];
        this.studies = user.studies ? user.studies : [];
        this.lairs = user.lairs ? user.lairs : [];
        this.locale = user.locale;
    }
}

module.exports = ProfileResponse;
