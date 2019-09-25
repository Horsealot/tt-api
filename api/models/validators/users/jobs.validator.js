const Joi = require('@hapi/joi');

const schemas = Joi.array().items(Joi.object({
    title: Joi.string().required(),
    company: Joi.string().required()
}));

module.exports = schemas;
