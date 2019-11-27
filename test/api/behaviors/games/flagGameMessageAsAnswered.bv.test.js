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
const UserModel = mongoose.model('User');

const messageType = require('@models/types/message');

const flagGameMessageAsAnsweredBehavior = require('@api/behaviors/games/flagGameMessageAsAnswered.bv');

const SESSION_ID = '5dcd4eeb2c1fcf120b532b19';
const Hydrator = require('./../../../hydrators');

describe('Flag game message as answered by behavior', () => {
    beforeEach((done) => {
        Hydrator.clean().then(() => {
            done();
        })
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should modify the message in the connection and the db one', (done) => {
        const connection = new ConnectionModel({session_id: SESSION_ID});
        const loggedUser = new UserModel({});
        let messages = [];
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const message = new MessageModel({connection_id: connection._id, type: messageType.MESSAGE});
            if (i === 6) {
                message.content = {
                    answered_by: []
                };
                message.type = messageType.GAMING;
            }
            connection.addMessage(message);
            messages.push(message);
            return message.save();
        })).then(() => {
            return connection.save();
        }).then(() => {
            return flagGameMessageAsAnsweredBehavior.flag(loggedUser, connection, messages[5]);
        }).then(() => {
            return ConnectionModel.findOne({_id: connection._id});
        }).then((dbConnection) => {
            expect(dbConnection.messages[5].content.answered_by.find((id) => id.toString() === loggedUser.id)).to.be.not.undefined;
            return MessageModel.findOne({_id: messages[5]._id});
        }).then((dbMessage) => {
            expect(dbMessage.content.answered_by.find((id) => id.toString() === loggedUser.id)).to.be.not.undefined;
            done();
        });
    });

    it('should not add two times the user in the answered_by', (done) => {
        const connection = new ConnectionModel({session_id: SESSION_ID});
        const loggedUser = new UserModel({});
        let messages = [];
        Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            const message = new MessageModel({connection_id: connection._id, type: messageType.MESSAGE});
            if (i === 6) {
                message.content = {
                    answered_by: []
                };
                message.type = messageType.GAMING;
            }
            connection.addMessage(message);
            messages.push(message);
            return message.save();
        })).then(() => {
            return connection.save();
        }).then(() => {
            return flagGameMessageAsAnsweredBehavior.flag(loggedUser, connection, messages[5]);
        }).then(() => {
            return flagGameMessageAsAnsweredBehavior.flag(loggedUser, connection, messages[5]);
        }).then(() => {
            return ConnectionModel.findOne({_id: connection._id});
        }).then((dbConnection) => {
            expect(dbConnection.messages[5].content.answered_by).to.be.an('array').of.length(1);
            expect(dbConnection.messages[5].content.answered_by.find((id) => id.toString() === loggedUser.id)).to.be.not.undefined;
            return MessageModel.findOne({_id: messages[5]._id});
        }).then((dbMessage) => {
            expect(dbMessage.content.answered_by).to.be.an('array').of.length(1);
            expect(dbMessage.content.answered_by.find((id) => id.toString() === loggedUser.id)).to.be.not.undefined;
            done();
        });
    });
});
