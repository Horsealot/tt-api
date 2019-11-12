//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const SessionModel = mongoose.model('Session');

const getUserPreviousSelectionCompletedBehavior = require('@api/behaviors/getUserPreviousSelectionCompleted.bv');

const USER_ID = '5dc04e414ec2aa08630ad483';

describe('Get user previous selection completed behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    it('should true if the current session is active', (done) => {
        const stubbedSession = {isActive: () => true};
        getUserPreviousSelectionCompletedBehavior.get(stubbedSession, USER_ID).then((previousSelectionCompleted) => {
            expect(previousSelectionCompleted).to.be.true;
            done();
        });
    });

    it('should true if the user did not participate in last session', (done) => {
        const stubbedSession = {isActive: () => false};
        const getLastSessionStub = sinon.stub(SessionModel, 'findSessionForSelection').resolves({id: 'fakeSessionId'});
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves(null);
        getUserPreviousSelectionCompletedBehavior.get(stubbedSession, USER_ID).then((previousSelectionCompleted) => {
            expect(previousSelectionCompleted).to.be.true;
            expect(getLastSessionStub.calledOnce).to.be.true;
            expect(getUserSessionStub.calledOnce).to.be.true;
            done();
        });
    });

    it('should true if the user already picked his favorite', (done) => {
        const stubbedSession = {isActive: () => false};
        const getLastSessionStub = sinon.stub(SessionModel, 'findSessionForSelection').resolves({id: 'fakeSessionId'});
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves({favorite_picked: 1});
        getUserPreviousSelectionCompletedBehavior.get(stubbedSession, USER_ID).then((previousSelectionCompleted) => {
            expect(previousSelectionCompleted).to.be.true;
            expect(getLastSessionStub.calledOnce).to.be.true;
            expect(getUserSessionStub.calledOnce).to.be.true;
            done();
        });
    });

    it('should true if the user did pick his previous favorite yet', (done) => {
        const stubbedSession = {isActive: () => false};
        const getLastSessionStub = sinon.stub(SessionModel, 'findSessionForSelection').resolves({id: 'fakeSessionId'});
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves({favorite_picked: 0});
        getUserPreviousSelectionCompletedBehavior.get(stubbedSession, USER_ID).then((previousSelectionCompleted) => {
            expect(previousSelectionCompleted).to.be.false;
            expect(getLastSessionStub.calledOnce).to.be.true;
            expect(getUserSessionStub.calledOnce).to.be.true;
            done();
        });
    });
});
