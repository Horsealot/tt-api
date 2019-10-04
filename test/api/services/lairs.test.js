//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;
const admin = require('firebase-admin');
const {AuthError} = require('@api/errors');
const UserModel = mongoose.model('User');

const LairsService = require('@api/services/lairs');
const rp = require('request-promise');

describe('Lairs service', () => {

    /**
     * Restore firebase stub
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Post user lairs', () => {
        it('call user internal token and post to the lairs service', (done) => {
            const user = new UserModel({});
            const postStub = sinon.stub(rp, 'post').resolves([]);
            const getInternalToken = sinon.stub(user, 'generateInternalJWT').returns('user_internal_token');
            LairsService.postUserLairs(user, ['fake_lair_id']).then(() => {
                expect(postStub.calledOnce).to.be.true;
                expect(getInternalToken.calledOnce).to.be.true;
                done();
            }).catch((err) => {
                expect(false).to.be.true;
                done();
            })
        });
        it('should throw an Error when the service call fails', (done) => {
            const user = new UserModel({});
            const postStub = sinon.stub(rp, 'post').rejects(new Error('test error'));
            const getInternalToken = sinon.stub(user, 'generateInternalJWT').returns('user_internal_token');
            LairsService.postUserLairs(user, ['fake_lair_id']).then(() => {
                throw new Error("wrong error");
            }).catch((err) => {
                expect(postStub.calledOnce).to.be.true;
                expect(getInternalToken.calledOnce).to.be.true;
                expect(err.message).to.be.equal('test error');
                done();
            })
        });
    });

    describe('Get user lairs', () => {
        it('call user internal token and post to the lairs service', (done) => {
            const user = new UserModel({});
            const postStub = sinon.stub(rp, 'get').resolves([]);
            const getInternalToken = sinon.stub(user, 'generateInternalJWT').returns('user_internal_token');
            LairsService.getUserLairs(user).then(() => {
                expect(postStub.calledOnce).to.be.true;
                expect(getInternalToken.calledOnce).to.be.true;
                done();
            }).catch((err) => {
                expect(false).to.be.true;
                done();
            })
        });
        it('should throw an Error when the service call fails', (done) => {
            const user = new UserModel({});
            const postStub = sinon.stub(rp, 'get').rejects(new Error('test error'));
            const getInternalToken = sinon.stub(user, 'generateInternalJWT').returns('user_internal_token');
            LairsService.getUserLairs(user).then(() => {
                throw new Error("wrong error");
            }).catch((err) => {
                expect(postStub.calledOnce).to.be.true;
                expect(getInternalToken.calledOnce).to.be.true;
                expect(err.message).to.be.equal('test error');
                done();
            })
        });
    });
});
