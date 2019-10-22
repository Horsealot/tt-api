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
const server = require('../../../server');

const Hydrators = require('./../../hydrators');

require('@models');
const UserModel = mongoose.model('User');

//Our parent block
describe('Ping Controller', () => {

    afterEach(() => {
        sinon.restore();
    });

    describe('Ping location', () => {
        it('should set user\'s location', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .post('/api/ping')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({lng: -88.12930, lat: 12.00009})
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                            expect(user.location.type).to.be.equal('Point');
                            expect(user.location.coordinates).to.be.an('array').of.length(2);
                            expect(user.location.coordinates[0]).to.be.equal(-88.12930);
                            expect(user.location.coordinates[1]).to.be.equal(12.00009);
                            done();
                        });
                    });
            });
        });
        it('should update user\'s location', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                user.location = {
                    type: 'Point',
                    coordinates: [0, 0]
                };
                return user.save();
            }).then((user) => {
                chai.request(server)
                    .post('/api/ping')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({lng: -88.12930, lat: 12.00009})
                    .end((err, res) => {
                        res.should.have.status(200);
                        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                            expect(user.location.type).to.be.equal('Point');
                            expect(user.location.coordinates).to.be.an('array').of.length(2);
                            expect(user.location.coordinates[0]).to.be.equal(-88.12930);
                            expect(user.location.coordinates[1]).to.be.equal(12.00009);
                            done();
                        });
                    });
            });
        });
    });
});
