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
const UserModel = mongoose.model('User');
const ConnectionModel = mongoose.model('Connection');
const MessageModel = mongoose.model('Message');
const connectionStatus = require('@models/types/connectionStatus');

const Hydrators = require('./../../hydrators');
const server = require('./../../../server');

require('@models');

//Our parent block
describe('Messenger Controller', () => {

    beforeEach(async () => {
        await Hydrators.clean()
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Get conversation', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .get('/api/connections/5db6f9ffaea41bc6791aebd6')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    describe('Get conversation page', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .get('/api/connections/5db6f9ffaea41bc6791aebd6/pages')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}/pages`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}/pages`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    describe('Post message', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .post('/api/connections/5db6f9ffaea41bc6791aebd6')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({message: 'fakeMessage'})
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send({message: 'fakeMessage'})
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send({message: 'fakeMessage'})
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    describe('Read connection', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .post('/api/connections/5db6f9ffaea41bc6791aebd6/read')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({message: 'fakeMessage'})
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}/read`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send({message: 'fakeMessage'})
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}/read`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            let userId;
            let message = new MessageModel({type: 1});
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.IN_SESSION
                });
                connection.addMessage(message);
                userJwt = user.generateJWT();
                userId = user._id;
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}/read`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200);
                        ConnectionModel.findOne({_id: connection._id}).then((connection) => {
                            expect(connection.readers[userId].last_read.toString()).to.be.equal(message.id);
                            done();
                        });
                    });
            });
        });
    });

    describe('Get connection game', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .get('/api/connections/5db6f9ffaea41bc6791aebd6/games')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}/games`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .get(`/api/connections/${connection._id}/games`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });

    describe('Post connection game', () => {
        it('should return 404 if the conversation does not exist', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .post('/api/connections/5db6f9ffaea41bc6791aebd6/games')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the user is not a member of the conversation', (done) => {
            let connection = new ConnectionModel({
                members: ['5dc2e260a3c81b2b20f4cad7', '5db2a7ce593f1f155df4c8b0'],
                session_id: '5dcc148adf9d0f03654a465a'
            });
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}/games`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
        it('should return 404 if the connection is expired', (done) => {
            let connection;
            let userJwt;
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                connection = new ConnectionModel({
                    members: ['5dc2e260a3c81b2b20f4cad7', user._id],
                    session_id: '5dcc148adf9d0f03654a465a',
                    status: connectionStatus.EXPIRED
                });
                userJwt = user.generateJWT();
                return connection.save();
            }).then((connection) => {
                chai.request(server)
                    .post(`/api/connections/${connection._id}/games`)
                    .set('Authorization', `Bearer ${userJwt}`)
                    .send()
                    .end((err, res) => {
                        res.should.have.status(404);
                        done();
                    });
            });
        });
    });
});
