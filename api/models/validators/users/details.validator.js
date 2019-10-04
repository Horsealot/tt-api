const Joi = require('@hapi/joi');

const schemas = Joi.object({
    firstname: Joi.string().trim().min(1).required(),
    lastname: Joi.string().trim(),
    height: Joi.number().integer().min(50),
    email: Joi.string().trim().email({minDomainSegments: 2}),
    date_of_birth: Joi.date().max('now').required(),
    bio: Joi.string().trim().max(512),
    physical_activity: Joi.number().integer().min(0).allow(null),
    astrological_sign: Joi.number().integer().min(0).allow(null),
    alcohol_habits: Joi.number().integer().min(0).allow(null),
    smoking_habits: Joi.number().integer().min(0).allow(null),
    kids_expectation: Joi.number().integer().min(0).allow(null),
    religion: Joi.number().integer().min(0).allow(null),
    political_affiliation: Joi.number().integer().min(0).allow(null),
    locale: Joi.string().valid('en', 'fr').default('en').required(),
});

module.exports = schemas;
