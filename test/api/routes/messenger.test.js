//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const should = chai.should();
const sinon = require('sinon');

require('@models');
const Hydrator = require('./../../hydrators');
const server = require('./../../../server');

chai.use(chaiHttp);
//Our parent block
describe('Messenger Route', () => {
    beforeEach((done) => {
        Hydrator.init().then(() => {
            done();
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the /GET conversation route
    */
    describe('GET /conversations/:conversationId', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .get('/api/conversations/5db6f9ffaea41bc6791aebd6')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    /*
    * Test the /GET conversation page route
    */
    describe('GET /conversations/:conversationId/pages', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .get('/api/conversations/5db6f9ffaea41bc6791aebd6/pages')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });

    /*
    * Test the /POST conversation route
    */
    describe('POST /conversations/:conversationId', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/conversations/5db6f9ffaea41bc6791aebd6')
                .send({message: 'Test'})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for a missing body message', (done) => {
            chai.request(server)
                .post('/api/conversations/5db6f9ffaea41bc6791aebd6')
                .send()
                .end((err, res) => {
                    res.should.have.status(422);
                    done();
                });
        });
    });

});
