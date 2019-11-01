const Joi = require('@hapi/joi');

const schemas = Joi.object({
    last_update_date: Joi.date(),
});

module.exports = schemas;
