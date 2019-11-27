const Joi = require('@hapi/joi');

const schemas = Joi.object({
    message: Joi.string().min(1).max(1000).required()
});

module.exports = schemas;
