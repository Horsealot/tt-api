//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;
const passport = require('passport');
const server = require('../../../server');

require('@models');
const UserModel = mongoose.model('User');

const {AuthError} = require('@api/errors');
const AuthController = require('@api/controllers/auth.ctrl');
const FirebaseService = require('@api/services/firebase');
const NexmoService = require('@api/services/nexmo');

const Hydrator = require('./../../hydrators');

//Our parent block
describe('Auth Controller', () => {

    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the Auth by firebase
    */
    describe('Auth Firebase', () => {
        it('should return an AuthError for invalid credentials', (done) => {
            const getUserPhoneStub = sinon.stub(FirebaseService, 'getUserPhone').rejects(new AuthError("Invalid"));
            AuthController.authFirebase('invalid_uid', 'or_access_token').then(() => {
                throw new Error('Test failed');
            }).catch((err) => {
                expect(getUserPhoneStub.calledOnce).to.be.true;
                expect(err).to.be.an.instanceOf(AuthError);
                done();
            });
        });
        it('should create a User when non existing', (done) => {
            const newPhoneNumber = 62929;
            const getUserPhoneStub = sinon.stub(FirebaseService, 'getUserPhone').resolves(newPhoneNumber);
            AuthController.authFirebase('valid_uid', 'access_token').then((user) => {
                expect(user).to.be.an('object');
                expect(user).to.have.property('id');
                expect(user).to.have.property('phone').equal(newPhoneNumber);
                UserModel.find({phone: newPhoneNumber}).then((users) => {
                    expect(getUserPhoneStub.calledOnce).to.be.true;
                    expect(users).to.be.an('array').length(1);
                    expect(users[0].id).to.be.equal(user.id);
                    done();
                });
            });
        });
        it('should update last login for an existing user', (done) => {
            const existingPhoneNumber = 629290000;
            let existingId;
            UserModel.findOne({phone: existingPhoneNumber}).then((existingUser) => {
                existingId = existingUser.id;
                const getUserPhoneStub = sinon.stub(FirebaseService, 'getUserPhone').resolves(existingPhoneNumber);
                AuthController.authFirebase('valid_uid', 'access_token').then((user) => {
                    expect(user).to.be.an('object');
                    expect(user).to.have.property('id').equal(existingId);
                    expect(user).to.have.property('phone').equal(existingPhoneNumber);
                    expect(getUserPhoneStub.calledOnce).to.be.true;
                    UserModel.countDocuments({phone: existingPhoneNumber}).then((count) => {
                        expect(count).to.be.equal(1);
                        done();
                    })
                });
            });
        });
    });

    /*
    * Test the request SMS code by nexmo
    */
    describe('Request SMS code', () => {
        it('should return an AuthError for invalid credentials', (done) => {
            const requestAuthCodeStub = sinon.stub(NexmoService, 'requestAuthCode').rejects(new AuthError("Invalid"));
            AuthController.requestAuthCode('invalid_phone').then(() => {
                throw new Error('Test failed');
            }).catch((err) => {
                expect(requestAuthCodeStub.calledOnce).to.be.true;
                expect(err).to.be.an.instanceOf(AuthError);
                done();
            });
        });
        it('should return the request Id', (done) => {
            const requestId = 62929;
            const requestAuthCodeStub = sinon.stub(NexmoService, 'requestAuthCode').resolves(requestId);
            AuthController.requestAuthCode('valid_phone_number').then((response) => {
                expect(requestAuthCodeStub.calledOnce).to.be.true;
                expect(response).to.be.equal(requestId);
                done();
            });
        });
    });

    /*
    * Test the request SMS code by nexmo
    */
    describe('Auth by SMS and code', () => {
        it('should return an AuthError for invalid code or request_id', (done) => {
            const validateAuthStub = sinon.stub(NexmoService, 'authenticate').rejects(new AuthError("Invalid"));
            AuthController.authByPhoneCode('invalid_request_id', 'or_code').then(() => {
                throw new Error('Test failed');
            }).catch((err) => {
                expect(validateAuthStub.calledOnce).to.be.true;
                expect(err).to.be.an.instanceOf(AuthError);
                done();
            });
        });

        it('should create a User when non existing', (done) => {
            const newPhoneNumber = 62929;
            const validateAuthStub = sinon.stub(NexmoService, 'authenticate').resolves(newPhoneNumber);
            AuthController.authByPhoneCode('valid_request_id', 'code').then((user) => {
                expect(user).to.be.an('object');
                expect(user).to.have.property('id');
                expect(user).to.have.property('phone').equal(newPhoneNumber);
                UserModel.find({phone: newPhoneNumber}).then((users) => {
                    expect(validateAuthStub.calledOnce).to.be.true;
                    expect(users).to.be.an('array').length(1);
                    expect(users[0].id).to.be.equal(user.id);
                    done();
                });
            });
        });
        it('should update last login for an existing user', (done) => {
            const existingPhoneNumber = 629290000;
            let existingId;
            UserModel.findOne({phone: existingPhoneNumber}).then((existingUser) => {
                existingId = existingUser.id;
                const validateAuthStub = sinon.stub(NexmoService, 'authenticate').resolves(existingPhoneNumber);
                AuthController.authByPhoneCode('valid_request_id', 'code').then((user) => {
                    expect(user).to.be.an('object');
                    expect(user).to.have.property('id').equal(existingId);
                    expect(user).to.have.property('phone').equal(existingPhoneNumber);
                    expect(validateAuthStub.calledOnce).to.be.true;
                    UserModel.countDocuments({phone: existingPhoneNumber}).then((count) => {
                        expect(count).to.be.equal(1);
                        done();
                    })
                });
            });
        });
    });

    describe('Auth facebook on a non existing user', () => {
        it('should create a user linked to the FB user with his data filled', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '10',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: 'facebook.user@dummy.com'}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'ACCESS_TOKEN'
                    }, null);
                return (req, res, next) => {
                };
            });
            chai.request(server)
                .post('/api/auth/facebook')
                .send({
                    access_token: 'TEST_TOKEN'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    UserModel.findOne({
                        email: 'facebook.user@dummy.com',
                        'facebookProvider.id': '10',
                        'facebookProvider.token': 'ACCESS_TOKEN'
                    }).then((createdUser) => {
                        expect(createdUser).to.be.not.null;
                        expect(createdUser.gender).to.be.equal('F');
                        expect(createdUser.firstname).to.be.equal('Tho');
                        expect(createdUser.email).to.be.equal('facebook.user@dummy.com');
                        expect(createdUser.lastname).to.be.equal('Last');
                        done();
                    });
                });
        });
    });

    describe('Auth facebook on an other existing user (email) but unauthentified', () => {
        it('should login the existing user', (done) => {
            const existingUser = new UserModel({
                email: 'facebook.user@dummy.com',
                firstname: 'Fitzpatrick'
            });
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '10',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: 'facebook.user@dummy.com'}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'ACCESS_TOKEN'
                    }, null);
                return (req, res, next) => {
                };
            });
            existingUser.save().then((existingUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .send({
                        access_token: 'TEST_TOKEN'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.find({
                            email: 'facebook.user@dummy.com',
                        }).then((createdUsers) => {
                            expect(createdUsers).to.be.length(1);
                            expect(createdUsers[0]).to.be.not.null;
                            expect(createdUsers[0].id).to.be.eq(existingUser.id);
                            expect(createdUsers[0].gender).to.be.equal('F');
                            expect(createdUsers[0].firstname).to.be.equal('Fitzpatrick');
                            expect(createdUsers[0].email).to.be.equal('facebook.user@dummy.com');
                            expect(createdUsers[0].lastname).to.be.equal('Last');
                            done();
                        });
                    });
            });
        });
    });

    describe('Auth facebook on an existing user', () => {
        it('should return 409 for a fb account already linked to another account', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '1',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: ''}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'ACCESS_TOKEN'
                    }, null);
                return (req, res, next) => {
                };
            });
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((loggedInUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .set('Authorization', 'Bearer ' + loggedInUser.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(409);
                        done();
                    });
            });
        });
        it('should update the fb token without refreshing the data for an user already linked to this fb account', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '1',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: ''}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'NEW_ACCESS_TOKEN'
                    }, null);
                return (req, res, next) => {
                };
            });
            UserModel.findOne({'facebookProvider.id': '1'}).then((loggedInUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .set('Authorization', 'Bearer ' + loggedInUser.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({
                            _id: loggedInUser.id,
                            'facebookProvider.id': '1',
                            'facebookProvider.token': 'NEW_ACCESS_TOKEN'
                        }).then((updatedUser) => {
                            expect(updatedUser.firstname).to.be.equal('Pat');
                            expect(updatedUser.lastname).to.be.equal('Hutson');
                            expect(updatedUser.gender).to.be.equal('M');
                            done();
                        });
                    });
            });
        });
        it('should link the user to the new fb account without refreshing the data for a user already linked to another fb account', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '2',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: ''}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'NEW_ACCESS_TOKEN'
                    }
                    , null);
                return (req, res, next) => {
                };
            });
            UserModel.findOne({'facebookProvider.id': '1'}).then((loggedInUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .set('Authorization', 'Bearer ' + loggedInUser.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({
                            _id: loggedInUser.id,
                            'facebookProvider.id': '2',
                            'facebookProvider.token': 'NEW_ACCESS_TOKEN'
                        }).then((updatedUser) => {
                            expect(updatedUser.firstname).to.be.equal('Pat');
                            expect(updatedUser.lastname).to.be.equal('Hutson');
                            expect(updatedUser.gender).to.be.equal('M');
                            done();
                        });
                    });
            });
        });
        it('should set the facebook data on undefined fields for a user without a fb account', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '2',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: ''}],
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'NEW_ACCESS_TOKEN'
                    }
                    , null);
                return (req, res, next) => {
                };
            });

            const newUser = new UserModel({
                active: true,
                date_of_birth: new Date(),
                firstname: "Pat",
                email: "new.pat@dummy.com",
                bio: "John Doe bio",
                locale: 'fr',
            });
            newUser.save().then((loggedInUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .set('Authorization', 'Bearer ' + loggedInUser.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({
                            _id: loggedInUser.id,
                            'facebookProvider.id': '2',
                            'facebookProvider.token': 'NEW_ACCESS_TOKEN'
                        }).then((updatedUser) => {
                            expect(updatedUser.firstname).to.be.equal('Pat');
                            expect(updatedUser.lastname).to.be.equal('Last');
                            expect(updatedUser.gender).to.be.equal('F');
                            done();
                        });
                    });
            });
        });
    });
    describe('Auth facebook on a logged user but with a fb email linked to another account', () => {
        it('should set the facebook data on the logged user without the email and set a duplicate_of on the other account', (done) => {
            sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
                callback(null,
                    {
                        provider: 'facebook',
                        id: '2',
                        displayName: 'Tho Last',
                        name: {familyName: 'Last', givenName: 'Tho', middleName: ''},
                        gender: 'Female',
                        emails: [{value: 'john.doe@dummy.com'}], // Existing email
                        photos: [
                            {
                                value: 'https://graph.facebook.com/v2.6/10157549849444812/picture?type=large'
                            }
                        ],
                        _raw: '{"name":"Tho Last","last_name":"Last","first_name":"Tho"}',
                        _json: {
                            name: 'Tho Last',
                            last_name: 'Last',
                            first_name: 'Tho'
                        },
                        accessToken: 'NEW_ACCESS_TOKEN'
                    }
                    , null);
                return (req, res, next) => {
                };
            });

            const newUser = new UserModel({
                active: true,
                date_of_birth: new Date(),
                firstname: "Pat",
                bio: "John Doe bio",
                locale: 'fr',
            });
            newUser.save().then((loggedInUser) => {
                chai.request(server)
                    .post('/api/auth/facebook')
                    .set('Authorization', 'Bearer ' + loggedInUser.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({
                            _id: loggedInUser.id,
                            'facebookProvider.id': '2',
                            'facebookProvider.token': 'NEW_ACCESS_TOKEN'
                        }).then((updatedUser) => {
                            expect(updatedUser.firstname).to.be.equal('Pat');
                            expect(updatedUser.lastname).to.be.equal('Last');
                            expect(updatedUser.gender).to.be.equal('F');

                            UserModel.findOne({email: 'john.doe@dummy.com'}).then((existingUser) => {
                                expect(existingUser.duplicate_of.toString()).to.be.eq(updatedUser.id);
                                done();
                            });
                        });
                    });
            });
        });
    })
});
