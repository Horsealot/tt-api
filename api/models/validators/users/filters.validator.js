const Joi = require('@hapi/joi');

const schemas = Joi.object({
    min_age: Joi.number().integer().min(18).max(Joi.ref('max_age')).required(),
    max_age: Joi.number().integer().min(18).max(100).required(),
    max_distance: Joi.number().integer().min(5).max(180).required(),
    gender: Joi.string().valid('M', 'F', 'B').required()
});

module.exports = schemas;
