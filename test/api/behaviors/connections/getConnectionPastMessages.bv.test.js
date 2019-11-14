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
const MessageModel = mongoose.model('Message');

const getConnectionPastMessagesBehavior = require('@api/behaviors/connections/getConnectionPastMessages.bv');
const Hydrators = require('./../../../hydrators');
const CONNECTION_ID = '5dc04e414ec2aa08630ad483';

describe('Get connection past messages behavior', () => {

    beforeEach(function () {
        return Hydrators.clean();
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should return all the messages if no last_id is provided', (done) => {
        let connection = new ConnectionModel({_id: CONNECTION_ID});
        let savedMessages = [];
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            savedMessages.push(new MessageModel({connection_id: connection._id, type: 1}));
            return savedMessages[i - 1].save();
        })).then(() => {
            return getConnectionPastMessagesBehavior.get(connection);
        }).then((messages) => {
            expect(messages).to.be.an('array').of.length(10);
            expect(messages[0].id).to.be.equal(savedMessages[0].id);
            expect(messages[1].id).to.be.equal(savedMessages[1].id);
            expect(messages[2].id).to.be.equal(savedMessages[2].id);
            expect(messages[3].id).to.be.equal(savedMessages[3].id);
            expect(messages[4].id).to.be.equal(savedMessages[4].id);
            expect(messages[5].id).to.be.equal(savedMessages[5].id);
            expect(messages[6].id).to.be.equal(savedMessages[6].id);
            expect(messages[7].id).to.be.equal(savedMessages[7].id);
            expect(messages[8].id).to.be.equal(savedMessages[8].id);
            expect(messages[9].id).to.be.equal(savedMessages[9].id);
            done();
        })
    });

    it('should return all the messages if no last_id is provided', (done) => {
        let connection = new ConnectionModel({_id: CONNECTION_ID});
        let savedMessages = [];
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            savedMessages.push(new MessageModel({connection_id: connection._id, type: 1}));
            return savedMessages[i - 1].save();
        })).then(() => {
            return getConnectionPastMessagesBehavior.get(connection, savedMessages[6]._id);
        }).then((messages) => {
            expect(messages).to.be.an('array').of.length(6);
            expect(messages[0].id).to.be.equal(savedMessages[0].id);
            expect(messages[1].id).to.be.equal(savedMessages[1].id);
            expect(messages[2].id).to.be.equal(savedMessages[2].id);
            expect(messages[3].id).to.be.equal(savedMessages[3].id);
            expect(messages[4].id).to.be.equal(savedMessages[4].id);
            expect(messages[5].id).to.be.equal(savedMessages[5].id);
            done();
        })
    });
});
