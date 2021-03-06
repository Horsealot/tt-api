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

    /*
    * Test the /PUT profile filters route
    */
    describe('PUT /profile/filters', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/filters')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/filters')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({min_age: 0})
                    .end((err, res) => {
                        res.should.have.status(422);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        done();
                    });
            });
        });
        it('should return 200 for valid inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/filters')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({
                        min_age: 20,
                        max_age: 40,
                        max_distance: 100,
                        gender: 'M'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT profile jobs route
    */
    describe('PUT /profile/jobs', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/jobs')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/jobs')
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
        it('should return 200 for valid inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/jobs')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send([{
                        title: 'Fullstack',
                        company: 'TrikTrak'
                    }])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT profile studies route
    */
    describe('PUT /profile/studies', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/studies')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/studies')
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
        it('should return 200 for valid inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/studies')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send([{
                        title: 'Engineering degree',
                        institution: 'ECAM'
                    }])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });
    });

    /*
    * Test the /PUT profile notifications route
    */
    describe('PUT /profile/notifications', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/notifications')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/notifications')
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
    });

    /*
    * Test the /POST profile upload route
    */
    describe('POST /profile/upload', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/profile/upload')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .post('/api/profile/upload?position=0')
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
    });


    /*
    * Test the /PUT profile lairs route
    */
    describe('PUT /profile/lairs', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/lairs')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/lairs')
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
    });


    /*
    * Test the /PUT profile details route
    */
    describe('PUT /profile/details', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .put('/api/profile/details')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
        it('should return 422 for bad inputs', (done) => {
            UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                chai.request(server)
                    .put('/api/profile/details')
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
    });


    /*
    * Test the /POST profile visibility
    */
    describe('POST /profile/visibility', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .post('/api/profile/visibility')
                .send({})
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });


    /*
    * Test the /DELETE profile visibility
    */
    describe('DELETE /profile/visibility', () => {
        it('should not accept an unauthenticated request', (done) => {
            chai.request(server)
                .delete('/api/profile/visibility')
                .send()
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                });
        });
    });
});
