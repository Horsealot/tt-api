//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const checkUserIsAllowedForSelectionBehavior = require('@api/behaviors/checkUserIsAllowedForSelection.bv');

describe('Organize user selection behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    it('should return true if the user did not picked anybody yet', (done) => {
        expect(checkUserIsAllowedForSelectionBehavior.isAllowed(
            {extra_selections: 0},
            {extra_selections: 0, favorite_picked: 0})).to.be.true;
        done();
    });

    it('should return false if the user has no extra', (done) => {
        expect(checkUserIsAllowedForSelectionBehavior.isAllowed(
            {extra_selections: 0},
            {extra_selections: 0, favorite_picked: 1})).to.be.false;
        done();
    });

    it('should return true if the user has an extra', (done) => {
        expect(checkUserIsAllowedForSelectionBehavior.isAllowed(
            {extra_selections: 1},
            {extra_selections: 0, favorite_picked: 1})).to.be.true;
        done();
    });

    it('should return true if the user has a session extra', (done) => {
        expect(checkUserIsAllowedForSelectionBehavior.isAllowed(
            {extra_selections: 0},
            {extra_selections: 1, favorite_picked: 1})).to.be.true;
        done();
    });

    it('should return true if the user has both extra', (done) => {
        expect(checkUserIsAllowedForSelectionBehavior.isAllowed(
            {extra_selections: 1},
            {extra_selections: 1, favorite_picked: 1})).to.be.true;
        done();
    });
});
