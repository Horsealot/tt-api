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
const Hydrator = require('./../../../hydrators');

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
        it('should return false for non expired pictures', (done) => {
            var inOneMonth = new Date();
            inOneMonth.setDate(inOneMonth.getDate() + 30);
            const user = new UserModel({
                pictures: [
                    {
                        source: 'expired picture',
                        expired_at: inOneMonth
                    },
                    {
                        source: 'valid picture',
                        expired_at: inOneMonth
                    }
                ]
            });
            expect(user.arePicturesExpired()).to.be.equal(false);
            done();
        });
        it('should return false if the user has no picture', (done) => {
            const user = new UserModel();
            expect(user.arePicturesExpired()).to.be.equal(false);
            done();
        });
    });
    describe('Set from facebook', () => {
        it('update empty fields using data provided by facebook', (done) => {
            const user = new UserModel();
            user.setFromFacebook({
                    provider: 'facebook',
                    id: '10',
                    displayName: 'John Wick',
                    name: {familyName: 'Wick', givenName: 'John', middleName: ''},
                    gender: 'male',
                    emails: [{value: 'wick@dummy.com'}],
                    photos: [
                        {
                            value: 'https://graph.facebook.com/v4.0/12/picture?type=large'
                        }
                    ],
                    _raw: '{"id":"10","name":"John Wick","last_name":"Wick","first_name":"John","email":"wick\\u0040dummy.com","gender":"male","friends":{"data":[],"summary":{"total_count":252}},"birthday":"02\\/07\\/1991"}',
                    _json: {
                        id: '10',
                        name: 'John Wick',
                        last_name: 'Wick',
                        first_name: 'John',
                        email: 'wick@dummy.com',
                        gender: 'male',
                        friends: {data: [], summary: {total_count: 100}},
                        birthday: '02/07/1991'
                    }
                }
            );
            expect(user.firstname).to.be.equal('John');
            expect(user.lastname).to.be.equal('Wick');
            expect(user.email).to.be.equal('wick@dummy.com');
            expect(user.gender).to.be.equal('M');
            done();
        });
        it('update not replace existing fields by data provided by facebook', (done) => {
            const user = new UserModel({
                firstname: 'MyOldFirstName',
                lastname: 'MyOldLastName',
                email: 'myold@dummy.com',
                gender: 'F',
            });
            user.setFromFacebook({
                    provider: 'facebook',
                    id: '10',
                    displayName: 'John Wick',
                    name: {familyName: 'Wick', givenName: 'John', middleName: ''},
                    gender: 'male',
                    emails: [{value: 'wick@dummy.com'}],
                    photos: [
                        {
                            value: 'https://graph.facebook.com/v4.0/12/picture?type=large'
                        }
                    ],
                    _raw: '{"id":"10","name":"John Wick","last_name":"Wick","first_name":"John","email":"wick\\u0040dummy.com","gender":"male","friends":{"data":[],"summary":{"total_count":252}},"birthday":"02\\/07\\/1991"}',
                    _json: {
                        id: '10',
                        name: 'John Wick',
                        last_name: 'Wick',
                        first_name: 'John',
                        email: 'wick@dummy.com',
                        gender: 'male',
                        friends: {data: [], summary: {total_count: 100}},
                        birthday: '02/07/1991'
                    }
                }
            );
            expect(user.firstname).to.be.equal('MyOldFirstName');
            expect(user.lastname).to.be.equal('MyOldLastName');
            expect(user.email).to.be.equal('myold@dummy.com');
            expect(user.gender).to.be.equal('F');
            done();
        });
    });
    describe('Upsert facebook user', () => {
        it('should create a new user if none is existing', (done) => {
            Hydrator.init().then(() => {
                UserModel.upsertFbUser({
                    provider: 'facebook',
                    id: '10',
                    displayName: 'John Wick',
                    name: {familyName: 'Wick', givenName: 'John', middleName: ''},
                    gender: 'male',
                    emails: [{value: 'wick@dummy.com'}],
                    photos: [
                        {
                            value: 'https://graph.facebook.com/v4.0/12/picture?type=large'
                        }
                    ],
                    _raw: '{"id":"10","name":"John Wick","last_name":"Wick","first_name":"John","email":"wick\\u0040dummy.com","gender":"male","friends":{"data":[],"summary":{"total_count":252}},"birthday":"02\\/07\\/1991"}',
                    _json: {
                        id: '10',
                        name: 'John Wick',
                        last_name: 'Wick',
                        first_name: 'John',
                        email: 'wick@dummy.com',
                        gender: 'male',
                        friends: {data: [], summary: {total_count: 100}},
                        birthday: '02/07/1991'
                    }
                }).then((user) => {
                    expect(user.firstname).to.be.equal('John');
                    expect(user.lastname).to.be.equal('Wick');
                    expect(user.email).to.be.equal('wick@dummy.com');
                    expect(user.facebookProvider.id).to.be.equal('10');
                    UserModel.findOne({email: 'wick@dummy.com', 'facebookProvider.id': '10'}).then((dbUser) => {
                        expect(dbUser).to.be.not.null;
                        done();
                    })
                });
            });
        });
        it('update not replace existing fields by data provided by facebook', (done) => {
            Hydrator.init().then(() => {
                const user = new UserModel({
                    firstname: 'MyOldFirstName',
                    email: 'myold@dummy.com',
                    gender: 'F',
                    facebookProvider: {
                        id: '10'
                    }
                });
                user.save().then(() => {
                    return UserModel.upsertFbUser({
                        provider: 'facebook',
                        id: '10',
                        displayName: 'John Wick',
                        name: {familyName: 'Wick', givenName: 'John', middleName: ''},
                        gender: 'male',
                        emails: [{value: 'wick@dummy.com'}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v4.0/12/picture?type=large'
                            }
                        ],
                        _raw: '{"id":"10","name":"John Wick","last_name":"Wick","first_name":"John","email":"wick\\u0040dummy.com","gender":"male","friends":{"data":[],"summary":{"total_count":252}},"birthday":"02\\/07\\/1991"}',
                        _json: {
                            id: '10',
                            name: 'John Wick',
                            last_name: 'Wick',
                            first_name: 'John',
                            email: 'wick@dummy.com',
                            gender: 'male',
                            friends: {data: [], summary: {total_count: 100}},
                            birthday: '02/07/1991'
                        }
                    });
                }).then((dbUser) => {
                    expect(dbUser.firstname).to.be.equal('MyOldFirstName');
                    expect(dbUser.lastname).to.be.equal('Wick');
                    expect(dbUser.email).to.be.equal('myold@dummy.com');
                    expect(dbUser.gender).to.be.equal('F');
                    done();
                });
            });
        });
    });
});
