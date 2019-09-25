const Joi = require('@hapi/joi');

const schemas = Joi.array().items(Joi.object({
    title: Joi.string().required(),
    institution: Joi.string().required(),
    graduation_date: Joi.date().iso()
}));

module.exports = schemas;
