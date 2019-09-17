const i18n = require('i18next');

const translationEN = require('./../../resources/locales/en');
const translationFR = require('./../../resources/locales/fr');

const locales = ['fr', 'en'];

// the translations
const resources = {
    en: {
        translation: translationEN
    },
    fr: {
        translation: translationFR
    }
};

i18n
    .init({
        resources,
        lng: "en",
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });


//
//
//
// const i18n = require('i18n');
//
// const locales = ['fr', 'en'];
//
// // the translations
// const resources = {
//     en: {
//         translation: translationEN
//     }
// };
//
// i18n.configure({
//     locales,
//     directory: __dirname + '/locales',
//     fallbackLng: 'en'
// });
//
//
//
module.exports = {
    locales
};