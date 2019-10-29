//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');
const server = require('./../../../server');

require('@models');

const SessionModel = mongoose.model('Session');
const UserModel = mongoose.model('User');

//Our parent block
describe('Session Controller', () => {

    afterEach(() => {
        sinon.restore();
    });

    describe('Get session status', () => {
        it('should return 450 if there is no future session', (done) => {
            const sessionStub = sinon.stub(SessionModel, 'findOne').resolves(null);
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .get('/api/session')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(450);
                        expect(sessionStub.calledOnce).to.be.true;
                        done();
                    });
            });
        });
        it('should return the session', (done) => {
            const sessionStub = sinon.stub(SessionModel, 'findOne').resolves({
                start_at: new Date(),
                end_at: new Date(),
            });
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .get('/api/session')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(sessionStub.calledOnce).to.be.true;
                        done();
                    });
            });
        });
    });
});
