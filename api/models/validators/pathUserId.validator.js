const Joi = require('@hapi/joi');

module.exports = Joi.object({
    userId: Joi.string().alphanum().min(24).max(24).required()
});

