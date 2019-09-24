const i18n = require('i18next');

const alcoholHabits = require('./alcoholHabits');
const astrologicalSigns = require('./astrologicalSigns');
const highestStudies = require('./highestStudies');
const kidsExpectation = require('./kidsExpectation');
const politicalAffiliation = require('./politicalAffiliation');
const physicalActivities = require('./physicalActivities');
const religion = require('./religion');
const smokingHabits = require('./smokingHabits');

/**
 * Extract value from a data converter using the provided key
 * @param data converter
 * @param key
 * @returns {*}
 */
const extractValue = (data, key) => {
    if (key in data) {
        return data[key];
    }
    return null;
};

/**
 * Translate values
 * @param data
 * @param locale
 * @returns {{}}
 */
const translateValues = (data, locale) => {
    return Object.keys(data).reduce((p, c) => ({...p, [c]: i18n.t(data[c], {lng: locale})}), {});
};

const self = {
    /**
     * Get alcohol habit from its key
     * @param value
     * @returns {*}
     */
    getAlcoholHabit: (value) => {
        return extractValue(alcoholHabits, value);
    },

    /**
     * Get all alcohol habits
     * @param locale
     * @returns {{}}
     */
    getAlcoholHabits: (locale) => {
        return translateValues(alcoholHabits, locale);
    },

    /**
     * Get astrological sign from its key
     * @param value
     * @returns {*}
     */
    getAstrologicalSign: (value) => {
        return extractValue(astrologicalSigns, value);
    },

    /**
     * Get all astrological signs
     * @param locale
     * @returns {{}}
     */
    getAstrologicalSigns: (locale) => {
        return translateValues(astrologicalSigns, locale);
    },

    /**
     * Get highest Study from its key
     * @param value
     * @returns {*}
     */
    getHighestStudy: (value) => {
        return extractValue(highestStudies, value);
    },

    /**
     * Get all highest studies
     * @param locale
     * @returns {{}}
     */
    getHighestStudies: (locale) => {
        return translateValues(highestStudies, locale);
    },

    /**
     * Get kids expectation from its key
     * @param value
     * @returns {*}
     */
    getKidsExpectation: (value) => {
        return extractValue(kidsExpectation, value);
    },

    /**
     * Get all kids expectation
     * @param locale
     * @returns {{}}
     */
    getKidsExpectations: (locale) => {
        return translateValues(kidsExpectation, locale);
    },

    /**
     * Get political affiliation from its key
     * @param value
     * @returns {*}
     */
    getPoliticalAffiliation: (value) => {
        return extractValue(politicalAffiliation, value);
    },

    /**
     * Get all political affiliations
     * @param locale
     * @returns {{}}
     */
    getPoliticalAffiliations: (locale) => {
        return translateValues(politicalAffiliation, locale);
    },

    /**
     * Get physical activity from its key
     * @param value
     * @returns {*}
     */
    getPhysicalActivity: (value) => {
        return extractValue(physicalActivities, value);
    },

    /**
     * Get all physical activities
     * @param locale
     * @returns {{}}
     */
    getPhysicalActivities: (locale) => {
        return translateValues(physicalActivities, locale);
    },

    /**
     * Get religion from its key
     * @param value
     * @returns {*}
     */
    getReligion: (value) => {
        return extractValue(religion, value);
    },

    /**
     * Get all religions
     * @param locale
     * @returns {{}}
     */
    getReligions: (locale) => {
        return translateValues(religion, locale);
    },

    /**
     * Get smoking habit from its key
     * @param value
     * @returns {*}
     */
    getSmokingHabit: (value) => {
        return extractValue(smokingHabits, value);
    },

    /**
     * Get all smoking habits
     * @param locale
     * @returns {{}}
     */
    getSmokingHabits: (locale) => {
        return translateValues(smokingHabits, locale);
    },

    /**
     * Get profile nomenclature
     * @param locale
     * @returns {{physical_activities: (*|{}), astrological_signs: (*|{}), political_affiliation: (*|{}), highest_studies: (*|{}), kids_expectations: (*|{}), alcohol_habits: (*|{}), smoking_habits: (*|{}), religion: (*|{})}}
     */
    getProfileNomenclature: (locale) => {
        return {
            'physical_activities': self.getPhysicalActivities(locale),
            'astrological_signs': self.getAstrologicalSigns(locale),
            'political_affiliations': self.getPoliticalAffiliations(locale),
            'highest_studies': self.getHighestStudies(locale),
            'kids_expectations': self.getKidsExpectations(locale),
            'alcohol_habits': self.getAlcoholHabits(locale),
            'smoking_habits': self.getSmokingHabits(locale),
            'religions': self.getReligions(locale)
        }
    }
};

module.exports = self;
