//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;

const ProfileController = require('@api/controllers/profile.ctrl');

const Hydrators = require('./../../hydrators');

require('@models');
const UserModel = mongoose.model('User');

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

    describe('UpdateUserFilters', () => {
        it('should refuse invalid parameters', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.updateUserFilters(user, {
                    min_age: 33,
                    max_age: 45,
                    max_distance: 111,
                    gender: 'M'
                });
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.filters.min_age).to.be.equal(33);
                expect(user.filters.max_age).to.be.equal(45);
                expect(user.filters.max_distance).to.be.equal(111);
                expect(user.filters.gender).to.be.equal('M');
                done();
            });
        })
    });
});
