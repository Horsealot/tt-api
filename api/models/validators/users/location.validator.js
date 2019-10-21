const Joi = require('@hapi/joi');

const schemas = Joi.object({
    lng: Joi.number().min(-180).max(180).required(),
    lat: Joi.number().min(-90).max(90).required(),
});

module.exports = schemas;
