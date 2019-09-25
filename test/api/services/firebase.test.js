//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const admin = require('firebase-admin');
const {AuthError} = require('@api/errors');

const FirebaseService = require('@api/services/firebase');

describe('Firebase service', () => {

    /**
     * Restore firebase stub
     */
    afterEach( function () {
        sinon.restore();
    });

    describe('Get User Phone', () => {
        it('should throw an AuthError for an invalid uid', (done) => {
            const getUserStub = sinon.stub(admin.auth(), "getUser").throws("Invalid uid");
            FirebaseService.getUserPhone("1", "2").then(() => {
                throw new Error("d dqsd qsdq ")
            }).catch((err) => {
                expect(getUserStub.calledOnce).to.be.true;
                expect(err).to.be.an.instanceOf(AuthError);
                done();
            })
        });
        it('should throw an AuthError for an invalid uid', (done) => {
            const getUserStub = sinon.stub(admin.auth(), "getUser").returns({phoneNumber: "111"});
            const verifyIdTokenStub = sinon.stub(admin.auth(), "verifyIdToken").returns({uid: "wrong_uid"});
            FirebaseService.getUserPhone("good_uid", "2").then(() => {
                throw new Error("d dqsd qsdq ")
            }).catch((err) => {
                expect(getUserStub.calledOnce).to.be.true;
                expect(verifyIdTokenStub.calledOnce).to.be.true;
                expect(err).to.be.an.instanceOf(AuthError);
                done();
            })
        });
        it('should return a phone number for a valid user', (done) => {
            const getUserStub = sinon.stub(admin.auth(), "getUser").returns({phoneNumber: "111"});
            const verifyIdTokenStub = sinon.stub(admin.auth(), "verifyIdToken").returns({uid: "good_uid"});
            FirebaseService.getUserPhone("good_uid", "2").then((phoneNumer) => {
                expect(getUserStub.calledOnce).to.be.true;
                expect(verifyIdTokenStub.calledOnce).to.be.true;
                expect(phoneNumer).to.be.equal('111');
                done();
            })
        });
    });
});
