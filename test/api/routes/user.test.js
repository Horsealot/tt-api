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

require('@models');
const Hydrator = require('./../../hydrators');

chai.use(chaiHttp);
//Our parent block
describe('User Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /POST invite user route
    */
    describe('POST /users/:userid/invite', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/users/5db6f9ffaea41bc6791aebd6/invite')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        // TODO
    });

    /*
    * Test the /DELETE user invite route
    */
    describe('DELETE /users/:userid/macaroon', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .delete('/api/users/5db6f9ffaea41bc6791aebd6/macaroon')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    /*
    * Test the /POST skip user route
    */
    describe('POST /users/:userid/skip', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/users/5db6f9ffaea41bc6791aebd6/skip')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
