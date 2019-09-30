const Joi = require('@hapi/joi');

const schemas = Joi.object({
    code: Joi.string().required()
});

module.exports = schemas;
