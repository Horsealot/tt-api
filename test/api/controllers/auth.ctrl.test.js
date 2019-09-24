//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;

require('./../../../api/models');
const UserModel = mongoose.model('User');

const {AuthError} = require('../../../api/errors');
const AuthController = require('./../../../api/controllers/auth.ctrl');
const FirebaseService = require('./../../../api/services/firebase');
const NexmoService = require('./../../../api/services/nexmo');

const Hydrator = require('./../../hydrators');

//Our parent block
describe('Auth Controller', () => {

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
            Hydrator.init().then(() => {
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
        });
        it('should update last login for an existing user', (done) => {
            Hydrator.init().then(() => {
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
            Hydrator.init().then(() => {
                const requestId = 62929;
                const requestAuthCodeStub = sinon.stub(NexmoService, 'requestAuthCode').resolves(requestId);
                AuthController.requestAuthCode('valid_phone_number').then((response) => {
                    expect(requestAuthCodeStub.calledOnce).to.be.true;
                    expect(response).to.be.equal(requestId);
                    done();
                });
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
            Hydrator.init().then(() => {
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
        });
        it('should update last login for an existing user', (done) => {
            Hydrator.init().then(() => {
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
    });
});
