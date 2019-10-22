const Joi = require('@hapi/joi');

const schemas = Joi.object({
    position: Joi.number().integer().min(1),
});

module.exports = schemas;
