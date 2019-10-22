process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const usersNotificationsValidator = require('@models/validators/users/notifications.validator');

describe('User notifications validator', () => {
    it('should failed on missing params', (done) => {
        expect(usersNotificationsValidator.validate({}).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
        }).error).to.be.not.undefined;
        done();
    });
    it('should failed on bad params', (done) => {
        expect(usersNotificationsValidator.validate({
            new_message: 10,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: 10,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: 10,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: 10,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: 10,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: 10,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: 10,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: 10,
            player_nearby: false,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: 10,
            signup_nearby: false,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: 10,
            company_updates: false
        }).error).to.be.not.undefined;
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: false,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: false,
            player_nearby: false,
            signup_nearby: false,
            company_updates: 10
        }).error).to.be.not.undefined;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(usersNotificationsValidator.validate({
            new_message: false,
            new_game: false,
            new_game_answer: false,
            new_macaroon: false,
            round_reminder: true,
            selection_reminder: false,
            new_favorite: false,
            macaroon_accepted: true,
            player_nearby: false,
            signup_nearby: false,
            company_updates: true
        }).error).to.be.undefined;
        done();
    });
});
