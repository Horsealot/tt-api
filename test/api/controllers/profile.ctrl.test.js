//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;

const ProfileController = require('./../../../api/controllers/profile.ctrl');

//Our parent block
describe('User Controller', () => {

    /*
    * Test the get Profile Nomenclature
    */
    describe('Get Profile Nomenclature', () => {
        it('should return the nomenclature of all fields', (done) => {
            const profileNomenclature = ProfileController.getProfileNomenclature();
            expect(profileNomenclature).to.be.an('object');
            expect(profileNomenclature).to.have.property('astrological_signs');
            expect(profileNomenclature).to.have.property('political_affiliations');
            expect(profileNomenclature).to.have.property('highest_studies');
            expect(profileNomenclature).to.have.property('kids_expectations');
            expect(profileNomenclature).to.have.property('physical_activities');
            expect(profileNomenclature).to.have.property('alcohol_habits');
            expect(profileNomenclature).to.have.property('smoking_habits');
            expect(profileNomenclature).to.have.property('religions');
            done();
        });
    });
});