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
const connectionStatus = require('@models/types/connectionStatus');

const getActiveConnectionBehavior = require('@api/behaviors/connections/getActiveConnection.bv');
const Hydrators = require('./../../../hydrators');
const CONNECTION_ID = '5dc04e414ec2aa08630ad483';
const USER_ID = '5d83431020e57635c3aeb52e';
const SESSION_ID = '5db85f92593f1f155df4cec8';

describe('Get active connection behavior', () => {

    beforeEach(function () {
        return Hydrators.clean();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should return nothing if the user is not a member of the connection', async () => {
        let connection = new ConnectionModel({_id: CONNECTION_ID, members: [], session_id: SESSION_ID});
        await connection.save();
        const result = await getActiveConnectionBehavior.get(CONNECTION_ID, USER_ID);
        expect(result).to.be.null;
    });

    it('should return nothing if the connection is expired', async () => {
        let connection = new ConnectionModel({
            _id: CONNECTION_ID,
            members: [USER_ID],
            session_id: SESSION_ID,
            status: connectionStatus.EXPIRED
        });
        await connection.save();
        const result = await getActiveConnectionBehavior.get(CONNECTION_ID, USER_ID);
        expect(result).to.be.null;
    });

    it('should return the connection', async () => {
        let connection = new ConnectionModel({_id: CONNECTION_ID, members: [USER_ID], session_id: SESSION_ID});
        await connection.save();
        const result = await getActiveConnectionBehavior.get(CONNECTION_ID, USER_ID);
        expect(result.id).to.be.equal(connection.id);
    });
});
