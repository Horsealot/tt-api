const Joi = require('@hapi/joi');

const schemas = Joi.array().items(Joi.string().alphanum().min(24).max(24).required());

module.exports = schemas;
