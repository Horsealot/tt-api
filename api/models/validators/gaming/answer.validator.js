const Joi = require('@hapi/joi');

const ratingValidator = require('./rating.validator');

const schema = Joi.object({
    rating: ratingValidator,
    answer: Joi.string()
}).xor('rating', 'answer');

module.exports = schema;
