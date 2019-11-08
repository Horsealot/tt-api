//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const UserModel = mongoose.model('User');
const UserSessionModel = mongoose.model('UserSession');

const SelectionCache = require('@api/caches/selections.cache');
const profileLoader = require('@api/loaders/profile');
const {UnauthorizedError} = require('@api/errors');

const getUserSelectionBehavior = require('@api/behaviors/getUserSelection.bv');

const USER_ID = '5dc04e414ec2aa08630ad483';

describe('Get user selection behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    // it('should throw an error if the user ', (done) => {
    //     const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(['test']);
    //     const setCacheStub = sinon.stub(SelectionCache, 'set').rejects('Should not be called');
    //     getUserSelectionBehavior.get({}).then((userSelection) => {
    //         expect(userSelection).to.be.an('array').of.length(1);
    //         expect(userSelection[0]).to.be.equal('test');
    //         expect(getCacheStub.calledOnce).to.be.true;
    //         expect(setCacheStub.called).to.be.false;
    //         done();
    //     });
    // });

    it('should return the cached version', (done) => {
        const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(['test']);
        const setCacheStub = sinon.stub(SelectionCache, 'set').rejects('Should not be called');
        getUserSelectionBehavior.get(new UserModel(), new UserSessionModel()).then((userSelection) => {
            expect(userSelection).to.be.an('array').of.length(1);
            expect(userSelection[0]).to.be.equal('test');
            expect(getCacheStub.calledOnce).to.be.true;
            expect(setCacheStub.called).to.be.false;
            done();
        });
    });

    it('should return the database connections when there is no cached version', (done) => {
        const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(null);
        const setCacheStub = sinon.stub(SelectionCache, 'set').resolves();
        const findStub = sinon.stub(ConnectionModel, 'find').resolves([
            {
                members: [USER_ID, '5db2a7e0593f1f155df4cad7']
            },
            {
                members: ['cad7a7e0593f1f155df4cad7', USER_ID]
            },
        ]);
        const loadUserStub = sinon.stub(profileLoader, 'getList').resolves(['test1', 'test2']);
        getUserSelectionBehavior.get(new UserModel({_id: USER_ID}), new UserSessionModel()).then((userSelection) => {
            expect(userSelection).to.be.an('array').of.length(2);
            expect(userSelection[0]).to.be.equal('test1');
            expect(userSelection[1]).to.be.equal('test2');
            expect(getCacheStub.calledOnce).to.be.true;
            expect(setCacheStub.called).to.be.true;
            expect(findStub.called).to.be.true;
            expect(loadUserStub.called).to.be.true;
            expect(loadUserStub.getCall(0).args[0]).to.be.eql(['5db2a7e0593f1f155df4cad7', 'cad7a7e0593f1f155df4cad7']);
            done();
        });
    });

    it('should fail if the user has no extra selection', (done) => {
        const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(null);
        const setCacheStub = sinon.stub(SelectionCache, 'set').resolves();
        const findStub = sinon.stub(ConnectionModel, 'find').resolves([
            {
                members: [USER_ID, '5db2a7e0593f1f155df4cad7']
            },
            {
                members: ['cad7a7e0593f1f155df4cad7', USER_ID]
            },
        ]);
        const loadUserStub = sinon.stub(profileLoader, 'getList').resolves(['test1', 'test2']);
        getUserSelectionBehavior.get(new UserModel({_id: USER_ID}), new UserSessionModel({favorite_picked: 1})).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(getCacheStub.called).to.be.false;
            expect(setCacheStub.called).to.be.false;
            expect(findStub.called).to.be.false;
            expect(loadUserStub.called).to.be.false;
            expect(err).to.be.an.instanceOf(UnauthorizedError);
            done();
        });
    });

    it('should not fail if the user has an extra selection on his profile', (done) => {
        const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(null);
        const setCacheStub = sinon.stub(SelectionCache, 'set').resolves();
        const findStub = sinon.stub(ConnectionModel, 'find').resolves([
            {
                members: [USER_ID, '5db2a7e0593f1f155df4cad7']
            },
            {
                members: ['cad7a7e0593f1f155df4cad7', USER_ID]
            },
        ]);
        const loadUserStub = sinon.stub(profileLoader, 'getList').resolves(['test1', 'test2']);
        getUserSelectionBehavior.get(new UserModel({
            _id: USER_ID,
            extra_selections: 1
        }), new UserSessionModel({favorite_picked: 1})).then((userSelection) => {
            expect(userSelection).to.be.an('array').of.length(2);
            expect(userSelection[0]).to.be.equal('test1');
            expect(userSelection[1]).to.be.equal('test2');
            expect(getCacheStub.calledOnce).to.be.true;
            expect(setCacheStub.called).to.be.true;
            expect(findStub.called).to.be.true;
            expect(loadUserStub.called).to.be.true;
            expect(loadUserStub.getCall(0).args[0]).to.be.eql(['5db2a7e0593f1f155df4cad7', 'cad7a7e0593f1f155df4cad7']);
            done();
        });
    });

    it('should not fail if the user has an extra selection for this session', (done) => {
        const getCacheStub = sinon.stub(SelectionCache, 'get').resolves(null);
        const setCacheStub = sinon.stub(SelectionCache, 'set').resolves();
        const findStub = sinon.stub(ConnectionModel, 'find').resolves([
            {
                members: [USER_ID, '5db2a7e0593f1f155df4cad7']
            },
            {
                members: ['cad7a7e0593f1f155df4cad7', USER_ID]
            },
        ]);
        const loadUserStub = sinon.stub(profileLoader, 'getList').resolves(['test1', 'test2']);
        getUserSelectionBehavior.get(new UserModel({_id: USER_ID}), new UserSessionModel({
            favorite_picked: 1,
            extra_selections: 1
        })).then((userSelection) => {
            expect(userSelection).to.be.an('array').of.length(2);
            expect(userSelection[0]).to.be.equal('test1');
            expect(userSelection[1]).to.be.equal('test2');
            expect(getCacheStub.calledOnce).to.be.true;
            expect(setCacheStub.called).to.be.true;
            expect(findStub.called).to.be.true;
            expect(loadUserStub.called).to.be.true;
            expect(loadUserStub.getCall(0).args[0]).to.be.eql(['5db2a7e0593f1f155df4cad7', 'cad7a7e0593f1f155df4cad7']);
            done();
        });
    });
});
