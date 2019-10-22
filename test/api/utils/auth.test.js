process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');

const Hydrator = require("../../hydrators");

const AuthUtils = require('@api/utils/auth');

describe('Auth Utils', () => {

    afterEach(() => {
        sinon.restore();
    });

    describe('Load user', () => {
        beforeEach((done) => {
            Hydrator.init().then(() => {
                done();
            });
        });

        it('should load the user', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                let res = {};
                res.sendStatus = sinon.stub().returns(res);
                const nextSpy = sinon.spy();
                AuthUtils.loadUser({payload: {id: user.id}}, res, nextSpy).then(() => {
                    expect(res.sendStatus.calledOnce).to.be.false;
                    expect(nextSpy.calledOnce).to.be.true;
                    done();
                });
            });
        });
        it('should return 400 if the user does not exists', (done) => {
            let res = {};
            const findStub = sinon.stub(UserModel, 'findOne').resolves(null);
            res.sendStatus = sinon.stub().returns(res);
            const nextSpy = sinon.spy();
            AuthUtils.loadUser({payload: {id: 1}}, res, nextSpy).then(() => {
                expect(res.sendStatus.calledOnce).to.be.true;
                expect(nextSpy.calledOnce).to.be.false;
                done();
            });
        });
        it('should return 400 if the database is unreachable', (done) => {
            let res = {};
            const findStub = sinon.stub(UserModel, 'findOne').rejects(new Error("Test error"));
            res.sendStatus = sinon.stub().returns(res);
            const nextSpy = sinon.spy();
            AuthUtils.loadUser({payload: {id: 1}}, res, nextSpy).then(() => {
                expect(res.sendStatus.calledOnce).to.be.true;
                expect(findStub.calledOnce).to.be.true;
                expect(nextSpy.calledOnce).to.be.false;
                done();
            });
        });
    });

    describe('Is user allowed', () => {
        beforeEach((done) => {
            Hydrator.init().then(() => {
                done();
            });
        });

        it('should return http code 500 if the user is not loaded', (done) => {
            let res = {};
            res.sendStatus = sinon.stub().returns(res);
            const nextSpy = sinon.spy();
            AuthUtils.isUserAllowed({}, res, nextSpy);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(nextSpy.calledOnce).to.be.false;
            done();
        });
        it('should return http code 401 if the user is locked', (done) => {
            let res = {};
            res.sendStatus = sinon.stub().returns(res);
            const nextSpy = sinon.spy();
            const user = new UserModel({
                status: {
                    locked: true
                }
            });
            AuthUtils.isUserAllowed({user}, res, nextSpy);
            expect(res.sendStatus.calledOnce).to.be.true;
            expect(nextSpy.calledOnce).to.be.false;
            done();
        });
        it('should call next if the user is not locked', (done) => {
            let res = {};
            res.sendStatus = sinon.stub().returns(res);
            const nextSpy = sinon.spy();
            const user = new UserModel({
                status: {
                    locked: false
                }
            });
            AuthUtils.isUserAllowed({user}, res, nextSpy);
            expect(res.sendStatus.calledOnce).to.be.false;
            expect(nextSpy.calledOnce).to.be.true;
            done();
        });
    });
});
