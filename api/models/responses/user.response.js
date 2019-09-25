const DateUtils = require('@api/utils/date');

const converter = require('@models/converters');

class UserResponse {
    constructor(user) {
        this.id = user._id;
        this.age = user.date_of_birth ? DateUtils.getUserAge(user.date_of_birth) : null;
        this.firstname = user.firstname;
        this.bio = user.bio;
        this.gender = user.gender;
        this.height = user.height;
        this.locale = user.locale;
        // TODO
        this.distance = -1;
        this.pictures = user.pictures;
        this.studies = user.studies.length > 0 ? user.studies[0] : null;
        this.jobs = user.jobs.length > 0 ? user.jobs[0] : null;
        this.lairs = user.lairs;
        this.physical_activity = converter.getPhysicalActivity(user.physical_activity);
        this.astrological_sign = user.astrological_sign;
        this.alcohol_habits = user.alcohol_habits;
        this.smoking_habits = user.smoking_habits;
        this.kids_expectation = user.kids_expectation;
        this.religion = user.religion;
        this.political_affiliation = user.political_affiliation;
    }
}

module.exports = UserResponse;
