const { prefixTranslations } = require('./tools');

const alcoholHabits = require('./fr/alcoholHabits');
const astrologicalSigns = require('./fr/astrologicalSigns');
const highestStudies = require('./fr/highestStudies');
const kidsExpectation = require('./fr/kidsExpectation');
const physicalActivity = require('./fr/physicalActivity');
const politicalAffiliation = require('./fr/politicalAffiliation');
const religion = require('./fr/religion');
const smokingHabits = require('./fr/smokingHabits');

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
