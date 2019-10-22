const Joi = require('@hapi/joi');

const schemas = Joi.array().items(Joi.object({
    title: Joi.string(),
    company: Joi.string()
}).or('title', 'company'));

module.exports = schemas;
