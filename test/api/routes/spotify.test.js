//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
let server = require('../../../server');
let should = chai.should();
let sinon = require('sinon');
let mongoose = require('mongoose');

const SpotifyController = require('@api/controllers/spotify.ctrl');

require('@models');
const UserModel = mongoose.model('User');

const Hydrator = require('./../../hydrators');

chai.use(chaiHttp);
//Our parent block
describe('Spotify Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });
    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /POST authorize route
    */
    describe('POST /spotify/authorize', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/spotify/authorize')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/spotify/authorize')
                .set('Authorization', 'Bearer ' + 'BADJWT')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for missing inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .post('/api/spotify/authorize')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({})
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });
        it('should return 422 for missing inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .post('/api/spotify/authorize')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({code: 1})
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });
        it('should 503 if an internal error occured', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                const linkStub = sinon.stub(SpotifyController, 'linkUser').rejects(new Error("Invalid"));
                chai.request(server)
                    .post('/api/spotify/authorize')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({code: "test_code"})
                    .end((err, res) => {
                        expect(linkStub.calledOnce).to.be.true;
                        res.should.have.status(503);
                        done();
                    });
            });
        });
        it('should return a UserResponse', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                const linkStub = sinon.stub(SpotifyController, 'linkUser').returns(user);
                chai.request(server)
                    .post('/api/spotify/authorize')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({code: "test_code"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.not.have.property('hash');
                        res.body.should.not.have.property('salt');
                        res.body.should.have.property('artists').to.be.a('array').of.length(0);
                        res.body.should.have.property('tracks').to.be.a('array').of.length(0);
                        expect(linkStub.calledOnce).to.be.true;
                        done();
                    });
            });
        });
    });
});
