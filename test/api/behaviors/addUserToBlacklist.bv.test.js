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
const UserBlacklistModel = mongoose.model('Blacklist');

const addUserToBlacklistBehavior = require('@api/behaviors/addUserToBlacklist.bv');

const USER_ID = '5dc04e414ec2aa08630ad483';
const ADDED_USER_ID = '5db2a7e0593f1f155df4cad7';

describe('Add to user blacklist behavior', () => {

    beforeEach((done) => {
        UserBlacklistModel.deleteMany({}).then(() => {
            done();
        });
    });

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Remove from session', () => {
        it('should create a blacklist if none is existing', (done) => {
            addUserToBlacklistBehavior.addToUserBlacklist(USER_ID, ADDED_USER_ID, 10).then(() => {
                UserBlacklistModel.findOne({user_id: USER_ID}).then((userBlacklist) => {
                    expect(userBlacklist).to.be.not.null;
                    expect(userBlacklist.data[0].user_id.toString()).to.be.equal(ADDED_USER_ID);
                    expect(userBlacklist.data[0].status).to.be.equal(10);
                    done();
                })
            });
        });
        it('should update the existing blacklist if it exists', (done) => {
            let userBlacklist = new UserBlacklistModel({user_id: USER_ID});
            userBlacklist.save().then((savedBlacklist) => {
                addUserToBlacklistBehavior.addToUserBlacklist(USER_ID, ADDED_USER_ID, 10).then(() => {
                    UserBlacklistModel.findOne({user_id: USER_ID}).then((userBlacklist) => {
                        expect(userBlacklist).to.be.not.null;
                        expect(userBlacklist.id).to.be.equal(savedBlacklist.id);
                        expect(userBlacklist.data[0].user_id.toString()).to.be.equal(ADDED_USER_ID);
                        expect(userBlacklist.data[0].status).to.be.equal(10);
                        done();
                    })
                });
            });
        });
    });
});
