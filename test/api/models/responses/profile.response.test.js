process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

require('@models');
const UserModel = mongoose.model('User');

const Hydrator = require('./../../../hydrators');
const ProfileResponse = require('@models/responses/profile.response');

describe('Profile Response', () => {
    before((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    it('should not contain any sensitive data', (done) => {
        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
            const profile = new ProfileResponse(user);
            expect(profile).to.be.an('object');
            expect(profile).to.not.have.property('hash');
            expect(profile).to.not.have.property('salt');
            expect(profile).to.not.have.property('created_at');
            expect(profile).to.not.have.property('last_updated_at');
            done();
        });
    });
    it('should contain all the required data', (done) => {
        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
            const profile = new ProfileResponse(user);
            expect(profile).to.be.an('object');
            expect(profile).to.have.property('id');
            expect(profile).to.have.property('active');
            expect(profile).to.have.property('firstname');
            expect(profile).to.have.property('lastname');
            expect(profile).to.have.property('phone');
            expect(profile).to.have.property('height');
            expect(profile).to.have.property('email');
            expect(profile).to.have.property('bio');
            expect(profile).to.have.property('date_of_birth');
            expect(profile).to.have.property('filters');
            expect(profile).to.have.property('notifications');
            // expect(profile).to.have.property('country_code');
            expect(profile).to.have.property('gender');
            expect(profile).to.have.property('physical_activity');
            expect(profile).to.have.property('astrological_sign');
            expect(profile).to.have.property('alcohol_habits');
            expect(profile).to.have.property('smoking_habits');
            expect(profile).to.have.property('kids_expectation');
            expect(profile).to.have.property('religion');
            expect(profile).to.have.property('political_affiliation');
            expect(profile).to.have.property('locale');
            expect(profile).to.have.property('pictures');
            expect(profile).to.have.property('jobs');
            expect(profile).to.have.property('studies');
            expect(profile).to.have.property('lairs');
            expect(profile).to.have.property('tracks');
            expect(profile).to.have.property('artists');
            done();
        });
    });
});
