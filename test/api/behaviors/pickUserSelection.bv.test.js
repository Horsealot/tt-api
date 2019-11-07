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
const ConnectionModel = mongoose.model('Connection');
const EventEmitter = require('@emitter');

const {UnauthorizedError} = require('@api/errors');
const connectionStatus = require('@models/types/connectionStatus');
const connectionEvent = require('@models/types/connectionEvent');

const pickUserSelectionBehavior = require('@api/behaviors/pickUserSelection.bv');

const USER_ID = '5dc04e414ec2aa08630ad483';
const ADDED_USER_ID = '5db2a7e0593f1f155df4cad7';
const SESSION_ID = '5dc2a34f3556f7251e1fc969';
const caster = require('@api/utils/caster');

const Hydrator = require('./../../hydrators');

describe('Pick user selection behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    it('should return an UnauthorizedError if the user has no session', (done) => {
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves(null);
        pickUserSelectionBehavior.pick({_id: SESSION_ID}, USER_ID, ADDED_USER_ID).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(getUserSessionStub.calledOnce).to.be.true;
            expect(err).to.be.an.instanceOf(UnauthorizedError);
            done();
        });
    });

    it('should return an UnauthorizedError if the user already picked a favorite for the session', (done) => {
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves(new UserSessionModel({favoritePicked: true}));
        pickUserSelectionBehavior.pick({_id: SESSION_ID}, USER_ID, ADDED_USER_ID).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(getUserSessionStub.calledOnce).to.be.true;
            expect(err).to.be.an.instanceOf(UnauthorizedError);
            done();
        });
    });

    it('should return an UnauthorizedError if the users are not connected', (done) => {
        const getUserSessionStub = sinon.stub(UserSessionModel, 'findOne').resolves(new UserSessionModel({favoritePicked: false}));
        const getConnectionStub = sinon.stub(ConnectionModel, 'findOne').resolves(null);
        pickUserSelectionBehavior.pick({_id: SESSION_ID}, USER_ID, ADDED_USER_ID).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(getUserSessionStub.calledOnce).to.be.true;
            expect(getConnectionStub.calledOnce).to.be.true;
            expect(err).to.be.an.instanceOf(UnauthorizedError);
            done();
        });
    });

    it('should work when user were connected during the session', (done) => {
        const eventEmitterStub = sinon.stub(EventEmitter, 'emit').returns(true);
        Hydrator.clean().then(() => {
            return (new ConnectionModel({
                members: [caster.toObjectId(USER_ID), caster.toObjectId(ADDED_USER_ID)],
                session_id: SESSION_ID
            })).save();
        }).then(() => {
            return (new UserSessionModel({
                user_id: USER_ID,
                session_id: SESSION_ID,
                favoritePicked: false
            })).save();
        }).then(() => {
            return pickUserSelectionBehavior.pick({_id: SESSION_ID}, USER_ID, ADDED_USER_ID);
        }).then(() => {
            return UserSessionModel.find({user_id: USER_ID, session_id: SESSION_ID});
        }).then((userSessions) => {
            expect(userSessions).to.be.an('array').of.length(1);
            expect(userSessions[0].favoritePicked).to.be.true;
            expect(userSessions[0].nbOfFavorites).to.be.equal(1);
            return ConnectionModel.find({session_id: SESSION_ID});
        }).then((connections) => {
            expect(connections).to.be.an('array').of.length(1);
            expect(connections[0].history).to.be.an('array').of.length(1);
            expect(connections[0].history[0].event).to.be.equal(connectionEvent.PICK_AS_FAVORITE);
            expect(connections[0].status).to.be.equal(connectionStatus.FAVORITE);
            expect(eventEmitterStub.calledOnce).to.be.true;
            done();
        });
    });
});
