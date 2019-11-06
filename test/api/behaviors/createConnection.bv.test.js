//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;
const {AuthError} = require('@api/errors');
require('@models');
const ConnectionModel = mongoose.model('Connection');

const createConnectionBehavior = require('@api/behaviors/createConnection.bv');
const Hydrators = require('./../../hydrators');

const connectionStatus = require('@models/types/connectionStatus');
const connectionEvent = require('@models/types/connectionEvent');

const USER_ID = '5dc04e414ec2aa08630ad483';
const ADDED_USER_ID = '5db2a7e0593f1f155df4cad7';

describe('Create connection behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    it('should throw an error if a connection is already existing', (done) => {
        const connectionStub = sinon.stub(ConnectionModel, 'findOne').resolves(new ConnectionModel({}));
        createConnectionBehavior.create(USER_ID, ADDED_USER_ID, new Date()).then(() => {
            throw new Error('TEST - Should fail')
        }).catch((e) => {
            expect(e).to.not.be.equal('TEST - Should fail');
            expect(connectionStub.calledOnce).to.be.true;
            done();
        });
    });

    it('should create a connection and set the default history', (done) => {
        Hydrators.clean().then(() => {
            createConnectionBehavior.create(USER_ID, ADDED_USER_ID, new Date()).then(() => {
                ConnectionModel.findOne({'$and': [{members: USER_ID}, {members: ADDED_USER_ID}]}).then((connection) => {
                    expect(connection).to.be.not.null;
                    expect(connection.status).to.be.equal(connectionStatus.IN_SESSION);
                    expect(connection.history).to.be.an('array').of.length(2);
                    expect(connection.history[0].event).to.be.equal(connectionEvent.SEND_MACAROON);
                    expect(connection.history[0].by.toString()).to.be.equal(USER_ID);
                    expect(connection.history[1].event).to.be.equal(connectionEvent.ACCEPTED_MACAROON);
                    expect(connection.history[1].by.toString()).to.be.equal(ADDED_USER_ID);
                    done();
                });
            });
        });
    });
});
