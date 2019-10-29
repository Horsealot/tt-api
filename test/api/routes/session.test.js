//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('./../../../server');
const should = chai.should();
const sinon = require('sinon');
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
require('@models');
const Hydrator = require('./../../hydrators');

chai.use(chaiHttp);
//Our parent block
describe('Session Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /GET invite user route
    */
    describe('GET /session/suggestions', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .get('/api/session/suggestions')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 450 if there is no session', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .get('/api/session/suggestions')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(450);
                        done();
                    });
            });
        });
        it('should return 450 if there is no active session', (done) => {
            Hydrator.initInactiveSession().then(() => {
                UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                    chai.request(server)
                        .get('/api/session/suggestions')
                        .set('Authorization', 'Bearer ' + user.generateJWT())
                        .send()
                        .end((err, res) => {
                            res.should.have.status(450);
                            done();
                        });
                });
            });
        });
    });

    /*
    * Test the /GET session route
    */
    describe('GET /session', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .get('/api/session')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
