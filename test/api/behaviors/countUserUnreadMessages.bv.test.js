//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const ConnectionModel = mongoose.model('Connection');
const MessageModel = mongoose.model('Message');
const UserModel = mongoose.model('User');
const expect = chai.expect;

const countUserUnreadMessagesBehavior = require('@api/behaviors/countUserUnreadMessages.bv');

describe('Count user unread messages behavior', () => {
    it('should return the number of messages if the user has not read any message yet', (done) => {
        let connection = new ConnectionModel({
            nb_of_messages: 10
        });
        let user = new UserModel();
        expect(countUserUnreadMessagesBehavior.count(user, connection)).to.be.equal(10);
        connection.nb_of_messages = 0;
        expect(countUserUnreadMessagesBehavior.count(user, connection)).to.be.equal(0);
        done();
    });
    it('should return 0 message when the user has read the conversation', (done) => {
        let connection = new ConnectionModel();
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
            connection.addMessage(new MessageModel());
        });
        let user = new UserModel();
        connection.readBy(user.id);
        expect(countUserUnreadMessagesBehavior.count(user, connection)).to.be.equal(0);
        done();
    });
    it('should return the right number of messages', (done) => {
        let connection = new ConnectionModel();
        let user = new UserModel();
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(() => {
            connection.addMessage(new MessageModel());
        });
        connection.readBy(user.id);
        [11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach(() => {
            connection.addMessage(new MessageModel());
        });
        expect(countUserUnreadMessagesBehavior.count(user, connection)).to.be.equal(10);
        done();
    });
});
