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
        // it('should accept an authenticated request', (done) => {
        //     const isInSessionStub = sinon.stub(sessionManager, 'isInSession').callsFake((req, res, next) => {
        //         next()
        //     });
        //     UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
        //         chai.request(server)
        //             .post('/api/users/5db6f9ffaea41bc6791aebd6/invite')
        //             .set('Authorization', 'Bearer ' + user.generateJWT())
        //             .send({lat: 0, lng: 0})
        //             .end((err, res) => {
        //                 // res.should.have.status(200);
        //                 expect(isInSessionStub.calledOnce).to.be.true;
        //                 done();
        //             });
        //     });
        // });
    });

    /*
    * Test the /DELETE user invite route
    */
    describe('DELETE /users/:userid/invite', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .delete('/api/users/5db6f9ffaea41bc6791aebd6/invite')
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
