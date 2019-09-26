//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

require('@models');
const UserModel = mongoose.model('User');
// const preTest = require('./preTest');

//Our parent block
describe('User model', () => {
    // beforeEach((done) => { //Before each test we empty the database
    //     preTest.cleanDB().then(() => {
    //         done();
    //     });
    // });


    /*
    * Test the user toJSON
    */
    describe('User toJSON', () => {
        it('should not contain any sensitive data', (done) => {
            const user = new UserModel();
            const jsonUser = user.toJSON();
            expect(jsonUser).to.be.an('object');
            expect(jsonUser).to.have.property('_id');
            expect(jsonUser).to.not.have.property('email');
            expect(jsonUser).to.not.have.property('lastname');
            expect(jsonUser).to.not.have.property('location');
            expect(jsonUser).to.not.have.property('phone');
            expect(jsonUser).to.not.have.property('phone_indicative');
            expect(jsonUser).to.not.have.property('hash');
            expect(jsonUser).to.not.have.property('salt');
            expect(jsonUser).to.not.have.property('filters');
            expect(jsonUser).to.not.have.property('active');
            expect(jsonUser).to.not.have.property('created_at');
            expect(jsonUser).to.not.have.property('last_updated_at');
            expect(jsonUser).to.not.have.property('date_of_birth');
            done();
        });
        it('should contain all the required data', (done) => {
            const user = new UserModel();
            const jsonUser = user.toJSON();
            expect(jsonUser).to.be.an('object');
            expect(jsonUser).to.have.property('_id');
            expect(jsonUser).to.have.property('age');
            expect(jsonUser).to.have.property('firstname');
            expect(jsonUser).to.have.property('bio');
            expect(jsonUser).to.have.property('gender');
            expect(jsonUser).to.have.property('height');
            expect(jsonUser).to.have.property('locale');
            expect(jsonUser).to.have.property('pictures');
            expect(jsonUser).to.have.property('studies');
            expect(jsonUser).to.have.property('jobs');
            expect(jsonUser).to.have.property('lairs');
            expect(jsonUser).to.have.property('physical_activity');
            expect(jsonUser).to.have.property('astrological_sign');
            expect(jsonUser).to.have.property('alcohol_habits');
            expect(jsonUser).to.have.property('smoking_habits');
            expect(jsonUser).to.have.property('kids_expectation');
            expect(jsonUser).to.have.property('religion');
            expect(jsonUser).to.have.property('political_affiliation');
            done();
        });
    });
    describe('Are Picture Expired', () => {
        it('should return true for one expired picture', (done) => {
            var oneMonthAgo = new Date();
            oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
            var inOneMonth = new Date();
            inOneMonth.setDate(inOneMonth.getDate() + 30);
            const user = new UserModel({
                pictures: [
                    {
                        source: 'expired picture',
                        expired_at: oneMonthAgo
                    },
                    {
                        source: 'valid picture',
                        expired_at: inOneMonth
                    }
                ]
            });
            expect(user.arePicturesExpired()).to.be.equal(true);
            done();
        });
    });
});
