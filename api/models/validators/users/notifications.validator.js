const Joi = require('@hapi/joi');

const schemas = Joi.object({
    new_message: Joi.boolean().required(),
    new_game: Joi.boolean().required(),
    new_game_answer: Joi.boolean().required(),
    new_macaroon: Joi.boolean().required(),
    round_reminder: Joi.boolean().required(),
    selection_reminder: Joi.boolean().required(),
    new_favorite: Joi.boolean().required(),
    macaroon_accepted: Joi.boolean().required(),
    player_nearby: Joi.boolean().required(),
    signup_nearby: Joi.boolean().required(),
    company_updates: Joi.boolean().required()
});

module.exports = schemas;
