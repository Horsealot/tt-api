//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('dotenv').config({path: '.env.test'});
//Require the dev-dependencies
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();
let sinon = require('sinon');
let mongoose = require('mongoose');

require('./../../../api/models');
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

    /*
    * Test the /GET users route
    */
    describe('GET /profile/nomenclature', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .get('/api/profile/nomenclature')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should accept an authenticated request', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                chai.request(server)
                    .get('/api/profile/nomenclature')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

});