//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let server = require('./../../../server');
let should = chai.should();
let sinon = require('sinon');
let mongoose = require('mongoose');

require('@models');
const UserModel = mongoose.model('User');

const Hydrator = require('./../../hydrators');

const blacklist = require('express-jwt-blacklist');

chai.use(chaiHttp);
//Our parent block
describe('Auth Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /POST users route
    */
    describe('POST /auth/logout', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/auth/logout')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should accept a request on a revoked jwt', (done) => {
            sinon.stub(blacklist, 'isRevoked').callsFake((req, payload, done) => {
                done(null, true);
            });
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .post('/api/auth/logout')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });
});
