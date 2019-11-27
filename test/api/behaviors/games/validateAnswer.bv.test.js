//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const ShuffleGameModel = require('mongoose').model('ShuffleGame');

const gameType = require('@models/types/shuffleGame');

const validateAnswerBehavior = require('@api/behaviors/games/validateAnswer.bv');

describe('Validate game answer behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });
    describe('Rating game', () => {
        it('should return false on a bad input', (done) => {
            const ratingGame = new ShuffleGameModel({type: gameType.RATING});
            expect(validateAnswerBehavior.isValid(ratingGame, 'a')).to.be.false;
            expect(validateAnswerBehavior.isValid(ratingGame, 0.1)).to.be.false;
            expect(validateAnswerBehavior.isValid(ratingGame, -1)).to.be.false;
            expect(validateAnswerBehavior.isValid(ratingGame, 6)).to.be.false;
            done();
        });
        it('should return true on a good input', (done) => {
            const ratingGame = new ShuffleGameModel({type: gameType.RATING});
            expect(validateAnswerBehavior.isValid(ratingGame, 0)).to.be.true;
            expect(validateAnswerBehavior.isValid(ratingGame, 1)).to.be.true;
            expect(validateAnswerBehavior.isValid(ratingGame, 2)).to.be.true;
            expect(validateAnswerBehavior.isValid(ratingGame, 3)).to.be.true;
            expect(validateAnswerBehavior.isValid(ratingGame, 4)).to.be.true;
            expect(validateAnswerBehavior.isValid(ratingGame, 5)).to.be.true;
            done();
        });
    });

    describe('Open question game', () => {
        it('should return false on a bad input', (done) => {
            const openGame = new ShuffleGameModel({type: gameType.OPEN_QUESTION});
            expect(validateAnswerBehavior.isValid(openGame, null)).to.be.false;
            expect(validateAnswerBehavior.isValid(openGame, undefined)).to.be.false;
            done();
        });
        it('should return true on a good input', (done) => {
            const openGame = new ShuffleGameModel({type: gameType.OPEN_QUESTION});
            expect(validateAnswerBehavior.isValid(openGame, 0)).to.be.true;
            expect(validateAnswerBehavior.isValid(openGame, 'test')).to.be.true;
            done();
        });
    });

    describe('2-choices game', () => {
        it('should return false on a bad input', (done) => {
            const game = new ShuffleGameModel({
                type: gameType.TWO_CHOICES,
                answers: [{label: '1', usage: 0}, {label: 'two', usage: 0}]
            });
            expect(validateAnswerBehavior.isValid(game, null)).to.be.false;
            expect(validateAnswerBehavior.isValid(game, undefined)).to.be.false;
            expect(validateAnswerBehavior.isValid(game, '')).to.be.false;
            done();
        });
        it('should return true on a good input', (done) => {
            const game = new ShuffleGameModel({
                type: gameType.TWO_CHOICES,
                answers: [{label: '1', usage: 0}, {label: 'two', usage: 0}]
            });
            expect(validateAnswerBehavior.isValid(game, '1')).to.be.true;
            expect(validateAnswerBehavior.isValid(game, 'two')).to.be.true;
            done();
        });
    });

    describe('n-choices game', () => {
        it('should return false on a bad input', (done) => {
            const game = new ShuffleGameModel({
                type: gameType.N_CHOICES, answers: [
                    {label: '1', usage: 0},
                    {label: 'two', usage: 0},
                    {label: 'three', usage: 0},
                    {label: 'four', usage: 0},
                ]
            });
            expect(validateAnswerBehavior.isValid(game, null)).to.be.false;
            expect(validateAnswerBehavior.isValid(game, undefined)).to.be.false;
            expect(validateAnswerBehavior.isValid(game, '')).to.be.false;
            done();
        });
        it('should return true on a good input', (done) => {
            const game = new ShuffleGameModel({
                type: gameType.N_CHOICES, answers: [
                    {label: '1', usage: 0},
                    {label: 'two', usage: 0},
                    {label: 'three', usage: 0},
                    {label: 'four', usage: 0},
                ]
            });
            expect(validateAnswerBehavior.isValid(game, '1')).to.be.true;
            expect(validateAnswerBehavior.isValid(game, 'two')).to.be.true;
            expect(validateAnswerBehavior.isValid(game, 'three')).to.be.true;
            expect(validateAnswerBehavior.isValid(game, 'four')).to.be.true;
            done();
        });
    });

});
