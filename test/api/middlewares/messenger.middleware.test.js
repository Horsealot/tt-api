//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const getActiveConnectionBehavior = require('@api/behaviors/connections/getActiveConnection.bv');
const expect = chai.expect;

const messengerMiddleware = require('@api/middlewares/messenger.middleware');

describe('Messenger middleware', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Load connection', () => {
        it('should not fail on an empty suggestions', (done) => {
            sinon.stub(getActiveConnectionBehavior, 'get').resolves(null);
            const user = new UserModel();
            messengerMiddleware.loadConnection(
                {
                    params: {id: 1},
                    user
                },
                {
                    sendStatus: () => {
                        done();
                    }
                },
                () => {
                    expect(true).to.be.false;
                    done();
                }
            );
        });

        it('should call next if the connection exists', (done) => {
            sinon.stub(getActiveConnectionBehavior, 'get').resolves({});
            const user = new UserModel();
            messengerMiddleware.loadConnection(
                {
                    params: {id: 1},
                    user
                },
                {
                    sendStatus: () => {
                        expect(true).to.be.false;
                        done();
                    }
                },
                () => {
                    done();
                }
            );
        });
    });
});
