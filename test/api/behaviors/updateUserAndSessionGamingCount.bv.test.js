//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const UserSessionModel = mongoose.model('UserSession');

const updateUserAndSessionGamingCountBehavior = require('@api/behaviors/updateUserAndSessionGamingCount.bv');

const Hydrator = require('./../../hydrators');

describe('Update user and session gaming count behavior', () => {

    /**
     */
    beforeEach(function (done) {
        Hydrator.clean().then(() => {
            done();
        })
    });
    afterEach(function () {
        sinon.restore();
    });

    it('should increment data', (done) => {
        let user = new UserModel({email: 'test@email.com'});
        let userSession = new UserSessionModel();
        user.save().then((user) => {
            userSession.user_id = user._id;
            userSession.session_id = '5db2a7c6593f1f155df4c7a3';
            return userSession.save();
        }).then(() => {
            return updateUserAndSessionGamingCountBehavior.increment(user.id, 'macaroons_sent', '5db2a7c6593f1f155df4c7a3', 'macaroons_sent');
        }).then(() => {
            return UserModel.findOne({email: 'test@email.com'});
        }).then((user) => {
            expect(user.gaming.macaroons_sent).to.be.equal(1);
            return UserSessionModel.findOne({session_id: '5db2a7c6593f1f155df4c7a3'});
        }).then((userSession) => {
            expect(userSession.macaroons_sent).to.be.equal(1);
            done();
        })
    });

    it('should not failed on an unknown user field', (done) => {
        let user = new UserModel({email: 'test@email.com'});
        let userSession = new UserSessionModel();
        user.save().then((user) => {
            userSession.user_id = user._id;
            userSession.session_id = '5db2a7c6593f1f155df4c7a3';
            return userSession.save();
        }).then(() => {
            return updateUserAndSessionGamingCountBehavior.increment(user.id, 'macaroon_sent', '5db2a7c6593f1f155df4c7a3', 'macaroons_sent');
        }).then(() => {
            return UserModel.findOne({email: 'test@email.com'});
        }).then((user) => {
            expect(user.gaming.macaroons_sent).to.be.equal(0);
            return UserSessionModel.findOne({session_id: '5db2a7c6593f1f155df4c7a3'});
        }).then((userSession) => {
            expect(userSession.macaroons_sent).to.be.equal(1);
            done();
        })
    });

    it('should not failed on an unknown userSession field data', (done) => {
        let user = new UserModel({email: 'test@email.com'});
        let userSession = new UserSessionModel();
        user.save().then((user) => {
            userSession.user_id = user._id;
            userSession.session_id = '5db2a7c6593f1f155df4c7a3';
            return userSession.save();
        }).then(() => {
            return updateUserAndSessionGamingCountBehavior.increment(user.id, 'macaroons_sent', '5db2a7c6593f1f155df4c7a3', 'macaro_sent');
        }).then(() => {
            return UserModel.findOne({email: 'test@email.com'});
        }).then((user) => {
            expect(user.gaming.macaroons_sent).to.be.equal(1);
            return UserSessionModel.findOne({session_id: '5db2a7c6593f1f155df4c7a3'});
        }).then((userSession) => {
            expect(userSession.macaroons_sent).to.be.equal(0);
            done();
        })
    });

    it('should not failed on an unknown user', (done) => {
        let user = new UserModel({email: 'test@email.com'});
        let userSession = new UserSessionModel();
        user.save().then(() => {
            userSession.user_id = '5d83431020e57635c3aeb52e';
            userSession.session_id = '5db2a7c6593f1f155df4c7a3';
            return userSession.save();
        }).then(() => {
            return updateUserAndSessionGamingCountBehavior.increment('5d83431020e57635c3aeb52e', 'macaroons_sent', '5db2a7c6593f1f155df4c7a3', 'macaroons_sent');
        }).then(() => {
            return UserSessionModel.findOne({session_id: '5db2a7c6593f1f155df4c7a3'});
        }).then((userSession) => {
            expect(userSession.macaroons_sent).to.be.equal(1);
            done();
        })
    });

    it('should not failed on an unknown userSession', (done) => {
        let user = new UserModel({email: 'test@email.com'});
        let userSession = new UserSessionModel();
        user.save().then((user) => {
            userSession.user_id = user._id;
            userSession.session_id = '5db2a7c6593f1f155df4c7a3';
            return userSession.save();
        }).then(() => {
            return updateUserAndSessionGamingCountBehavior.increment(user.id, 'macaroons_sent', '5d83431020e57635c3aeb52e', 'macaroons_sent');
        }).then(() => {
            return UserModel.findOne({email: 'test@email.com'});
        }).then((user) => {
            expect(user.gaming.macaroons_sent).to.be.equal(1);
            done();
        })
    });
});
