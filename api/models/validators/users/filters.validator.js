const Joi = require('@hapi/joi');

const schemas = Joi.object({
    min_age: Joi.number().min(18).max(100).required(),
    max_age: Joi.number().min(18).max(100).required(),
    max_distance: Joi.number().min(5).max(180).required(),
    gender: Joi.string().valid('M', 'F', 'B').required()
});

module.exports = schemas;
