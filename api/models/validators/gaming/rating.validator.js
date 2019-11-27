const Joi = require('@hapi/joi');

module.exports = Joi.number()
    .integer()
    .min(0)
    .max(5);
