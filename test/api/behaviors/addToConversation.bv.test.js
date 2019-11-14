//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;
require('@models');
const UserModel = mongoose.model('User');
const ConnectionModel = mongoose.model('Connection');
const MessageModel = mongoose.model('Message');

const addToConversationBehavior = require('@api/behaviors/addToConversation.bv');
const Hydrators = require('./../../hydrators');

const messageType = require('@models/types/message');

const USER_ID_1 = '5dc04e414ec2aa08630ad483';
const USER_ID_2 = '5db2a7e0593f1f155df4cad7';

describe('Add message to conversation behavior', () => {

    beforeEach(function (done) {
        Hydrators.clean().then(() => {
            done();
        });
    });

    describe('Add member message', () => {
        it('should add the message to the connection and create a message entity', (done) => {
            let connection = new ConnectionModel({
                members: [USER_ID_1, USER_ID_2],
                session_id: '5db85f92593f1f155df4cec8'
            });
            let sender = new UserModel({_id: USER_ID_1});
            connection.save().then(() => {
                return sender.save();
            }).then(() => {
                return addToConversationBehavior.addMemberMessage(connection, sender, 'My new message');
            }).then(() => {
                return ConnectionModel.findOne({});
            }).then((connection) => {
                expect(connection.messages).to.be.an('array').of.length(1);
                expect(connection.messages[0].readers).to.be.an('array').of.length(1);
                expect(connection.messages[0].sender).to.be.eql(sender._id);
                expect(connection.messages[0].content.data).to.be.equal('My new message');
                expect(connection.messages[0].type).to.be.equal(messageType.MESSAGE);
                expect(connection.readers[sender._id].last_read.toString()).to.be.equal(connection.messages[0].id);
                return MessageModel.find({});
            }).then((messages) => {
                expect(messages).to.be.an('array').of.length(1);
                expect(messages[0]._id).to.be.eql(connection.messages[0]._id);
                expect(messages[0].readers).to.be.an('array').of.length(1);
                expect(messages[0].sender).to.be.eql(sender._id);
                expect(messages[0].content.data).to.be.equal('My new message');
                expect(messages[0].type).to.be.equal(messageType.MESSAGE);
                done();
            });
        });
    });

    describe('Add notification message', () => {
        it('should add the message to the connection and create a message entity', (done) => {
            let connection = new ConnectionModel({
                members: [USER_ID_1, USER_ID_2],
                session_id: '5db85f92593f1f155df4cec8'
            });
            let sender = new UserModel({_id: USER_ID_1});
            connection.save().then(() => {
                return sender.save();
            }).then(() => {
                return addToConversationBehavior.addNotification(connection, 'Notification value', new Date(), {sender: sender._id});
            }).then(() => {
                return ConnectionModel.findOne({members: USER_ID_1});
            }).then((connection) => {
                expect(connection.messages).to.be.an('array').of.length(1);
                expect(connection.messages[0].readers).to.be.an('array').of.length(0);
                expect(connection.messages[0].content.payload.sender).to.be.eql(sender._id);
                expect(connection.messages[0].content.data).to.be.equal('Notification value');
                expect(connection.messages[0].type).to.be.equal(messageType.NOTIFICATION);
                return MessageModel.find({});
            }).then((messages) => {
                expect(messages).to.be.an('array').of.length(1);
                expect(messages[0]._id).to.be.eql(connection.messages[0]._id);
                expect(messages[0].readers).to.be.an('array').of.length(0);
                expect(messages[0].content.payload.sender).to.be.eql(sender._id);
                expect(messages[0].content.data).to.be.equal('Notification value');
                expect(messages[0].type).to.be.equal(messageType.NOTIFICATION);
                done();
            });
        });
    });
});
