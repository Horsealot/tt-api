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

chai.use(chaiHttp);
//Our parent block
describe('Profile Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /POST ping route
    */
    describe('POST /ping', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/ping')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should accept an authenticated request', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .post('/api/ping')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({lat: 0, lng: 0})
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });
    });
});
