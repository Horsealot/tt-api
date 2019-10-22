const Joi = require('@hapi/joi');

const schemas = Joi.array().items(Joi.object({
    title: Joi.string(),
    institution: Joi.string(),
    graduation_date: Joi.date().iso()
}).or('title', 'institution'));

module.exports = schemas;
