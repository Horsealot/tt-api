const { prefixTranslations } = require('./tools');

const alcoholHabits = require('./en/alcoholHabits');
const astrologicalSigns = require('./en/astrologicalSigns');
const highestStudies = require('./en/highestStudies');
const kidsExpectation = require('./en/kidsExpectation');
const physicalActivity = require('./en/physicalActivity');
const politicalAffiliation = require('./en/politicalAffiliation');
const religion = require('./en/religion');
const smokingHabits = require('./en/smokingHabits');

module.exports = {
    ...prefixTranslations(alcoholHabits, 'alcohol-habits'),
    ...prefixTranslations(astrologicalSigns, 'astrological-signs'),
    ...prefixTranslations(highestStudies, 'highest-studies'),
    ...prefixTranslations(kidsExpectation, 'kids-expectation'),
    ...prefixTranslations(physicalActivity, 'physical-activity'),
    ...prefixTranslations(politicalAffiliation, 'political-affiliation'),
    ...prefixTranslations(religion, 'religion'),
    ...prefixTranslations(smokingHabits, 'smoking-habits'),
};
