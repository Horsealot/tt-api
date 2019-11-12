//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const organizeUserSelectionBehavior = require('@api/behaviors/organizeUserSelection.bv');

describe('Organize user selection behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Organize by round', () => {
        it('should not fail on an empty suggestions', (done) => {
            const organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([]);
            expect(organizedSuggestions).to.be.an('array').of.length(0);
            done();
        });
        it('should return a first block of 4 peoples', (done) => {
            let organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([{id: 1}]);
            expect(organizedSuggestions).to.be.an('array').of.length(1);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(1);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(1);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(3);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3, 4].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(1);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            expect(organizedSuggestions[0][3].id).to.be.equal(4);
            done();
        });
        it('should return a blocks of 3 people or less', (done) => {
            let organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3, 4, 5].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(2);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            expect(organizedSuggestions[0][3].id).to.be.equal(4);
            expect(organizedSuggestions[1]).to.be.an('array').of.length(1);
            expect(organizedSuggestions[1][0].id).to.be.equal(5);
            organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3, 4, 5, 6, 7].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(2);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            expect(organizedSuggestions[0][3].id).to.be.equal(4);
            expect(organizedSuggestions[1]).to.be.an('array').of.length(3);
            expect(organizedSuggestions[1][0].id).to.be.equal(5);
            expect(organizedSuggestions[1][1].id).to.be.equal(6);
            expect(organizedSuggestions[1][2].id).to.be.equal(7);
            organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3, 4, 5, 6, 7, 8].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(3);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            expect(organizedSuggestions[0][3].id).to.be.equal(4);
            expect(organizedSuggestions[1]).to.be.an('array').of.length(3);
            expect(organizedSuggestions[1][0].id).to.be.equal(5);
            expect(organizedSuggestions[1][1].id).to.be.equal(6);
            expect(organizedSuggestions[1][2].id).to.be.equal(7);
            expect(organizedSuggestions[2]).to.be.an('array').of.length(1);
            expect(organizedSuggestions[2][0].id).to.be.equal(8);
            organizedSuggestions = organizeUserSelectionBehavior.organizeByRounds([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((id) => {
                return {id};
            }));
            expect(organizedSuggestions).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0]).to.be.an('array').of.length(4);
            expect(organizedSuggestions[0][0].id).to.be.equal(1);
            expect(organizedSuggestions[0][1].id).to.be.equal(2);
            expect(organizedSuggestions[0][2].id).to.be.equal(3);
            expect(organizedSuggestions[0][3].id).to.be.equal(4);
            expect(organizedSuggestions[1]).to.be.an('array').of.length(3);
            expect(organizedSuggestions[1][0].id).to.be.equal(5);
            expect(organizedSuggestions[1][1].id).to.be.equal(6);
            expect(organizedSuggestions[1][2].id).to.be.equal(7);
            expect(organizedSuggestions[2]).to.be.an('array').of.length(3);
            expect(organizedSuggestions[2][0].id).to.be.equal(8);
            expect(organizedSuggestions[2][1].id).to.be.equal(9);
            expect(organizedSuggestions[2][2].id).to.be.equal(10);
            expect(organizedSuggestions[3]).to.be.an('array').of.length(1);
            expect(organizedSuggestions[3][0].id).to.be.equal(11);
            done();
        });
    });
});
