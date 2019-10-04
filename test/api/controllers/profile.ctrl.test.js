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

const ProfileController = require('@api/controllers/profile.ctrl');
const LairsService = require('@api/services/lairs');

const Hydrators = require('./../../hydrators');

require('@models');
const UserModel = mongoose.model('User');
const ObjectID = require('mongodb').ObjectID;

//Our parent block
describe('User Controller', () => {

    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the get Profile Nomenclature
    */
    describe('Get Profile Nomenclature', () => {
        it('should return the nomenclature of all fields', (done) => {
            const profileNomenclature = ProfileController.getProfileNomenclature();
            expect(profileNomenclature).to.be.an('object');
            expect(profileNomenclature).to.have.property('astrological_signs');
            expect(profileNomenclature).to.have.property('political_affiliations');
            expect(profileNomenclature).to.have.property('highest_studies');
            expect(profileNomenclature).to.have.property('kids_expectations');
            expect(profileNomenclature).to.have.property('physical_activities');
            expect(profileNomenclature).to.have.property('alcohol_habits');
            expect(profileNomenclature).to.have.property('smoking_habits');
            expect(profileNomenclature).to.have.property('religions');
            done();
        });
    });

    describe('UpdateUserFilters', () => {
        it('should update user filters', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.updateUserFilters(user, {
                    min_age: 33,
                    max_age: 45,
                    max_distance: 111,
                    gender: 'M'
                });
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.filters.min_age).to.be.equal(33);
                expect(user.filters.max_age).to.be.equal(45);
                expect(user.filters.max_distance).to.be.equal(111);
                expect(user.filters.gender).to.be.equal('M');
                done();
            });
        })
    });

    describe('Update User Jobs', () => {
        it('should update user jobs', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.updateUserJobs(user, [
                    {
                        title: 'Fullstack',
                        company: 'TrikTrak'
                    },
                    {
                        title: 'Community Manager',
                        company: 'RDS'
                    },
                ]);
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.jobs).to.be.length(2);
                expect(user.jobs[0].title).to.be.equal('Fullstack');
                expect(user.jobs[0].company).to.be.equal('TrikTrak');
                expect(user.jobs[1].title).to.be.equal('Community Manager');
                expect(user.jobs[1].company).to.be.equal('RDS');
                done();
            });
        })
    });

    describe('Update User Studies', () => {
        it('should update user studies', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.updateUserStudies(user, [
                    {
                        title: 'Engineering degree',
                        institution: 'ECAM',
                        graduation_date: '2008-09-15T15:53:00'
                    },
                    {
                        title: 'Bachelor degree',
                        institution: 'RDS'
                    },
                ]);
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.studies).to.be.length(2);
                expect(user.studies[0].title).to.be.equal('Engineering degree');
                expect(user.studies[0].institution).to.be.equal('ECAM');
                expect(user.studies[0].graduation_date).to.be.eql(new Date('2008-09-15T15:53:00'));
                expect(user.studies[1].title).to.be.equal('Bachelor degree');
                expect(user.studies[1].institution).to.be.equal('RDS');
                expect(user.studies[1].graduation_date).to.be.undefined;
                done();
            });
        })
    });

    describe('Upload Picture', () => {
        it('should add the picture at the end', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-picture-path');
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.pictures).to.be.length(1);
                expect(user.pictures[0].source).to.be.equal('my-picture-path');
                return user;
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-second-picture-path');
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.pictures).to.be.length(2);
                expect(user.pictures[0].source).to.be.equal('my-picture-path');
                expect(user.pictures[1].source).to.be.equal('my-second-picture-path');
                done();
            });
        });
        it('should insert the picture at the right position', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-picture-path');
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-second-picture-path');
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-replacing-second-picture-path', 2);
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-picture-path-on-last-position', 3);
            }).then((user) => {
                return ProfileController.uploadPicture(user, 'my-picture-path-with-overflow-position', 20);
            }).then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                expect(user.pictures).to.be.length(5);
                expect(user.pictures[0].source).to.be.equal('my-picture-path');
                expect(user.pictures[1].source).to.be.equal('my-replacing-second-picture-path');
                expect(user.pictures[2].source).to.be.equal('my-picture-path-on-last-position');
                expect(user.pictures[3].source).to.be.equal('my-second-picture-path');
                expect(user.pictures[4].source).to.be.equal('my-picture-path-with-overflow-position');
                done();
            });
        })
    });

    describe('Update User Pictures', () => {
        it('should reorder the pictures', (done) => {
            const idPicture1 = new ObjectID();
            const idPicture2 = new ObjectID();
            const idPicture3 = new ObjectID();
            const user = new UserModel({
                pictures: [
                    {
                        _id: idPicture1,
                        source: 'picture-1',
                    },
                    {
                        _id: idPicture2,
                        source: 'picture-2',
                    },
                    {
                        _id: idPicture3,
                        source: 'picture-3',
                    }
                ]
            });

            user.save().then((user) => {
                ProfileController.updateUserPictures(user, [idPicture2.toString(), idPicture1.toString(), idPicture3.toString()]).then((user) => {
                    expect(user.pictures).to.be.length(3);
                    expect(user.pictures[0]._id).to.be.eq(idPicture2);
                    expect(user.pictures[0].source).to.be.equal('picture-2');
                    expect(user.pictures[1]._id).to.be.eq(idPicture1);
                    expect(user.pictures[1].source).to.be.equal('picture-1');
                    expect(user.pictures[2]._id).to.be.eq(idPicture3);
                    expect(user.pictures[2].source).to.be.equal('picture-3');
                    done();
                });
            });
        });
        it('should remove the picture', (done) => {
            const idPicture1 = new ObjectID();
            const idPicture2 = new ObjectID();
            const idPicture3 = new ObjectID();
            const user = new UserModel({
                pictures: [
                    {
                        _id: idPicture1,
                        source: 'picture-1',
                    },
                    {
                        _id: idPicture2,
                        source: 'picture-2',
                    },
                    {
                        _id: idPicture3,
                        source: 'picture-3',
                    }
                ]
            });

            user.save().then((user) => {
                ProfileController.updateUserPictures(user, [idPicture2.toString(), idPicture1.toString()]).then((user) => {
                    expect(user.pictures).to.be.length(2);
                    expect(user.pictures[0]._id).to.be.eq(idPicture2);
                    expect(user.pictures[0].source).to.be.equal('picture-2');
                    expect(user.pictures[1]._id).to.be.eq(idPicture1);
                    expect(user.pictures[1].source).to.be.equal('picture-1');
                    done();
                });
            });
        });
        it('should remove all the picture', (done) => {
            const idPicture1 = new ObjectID();
            const idPicture2 = new ObjectID();
            const idPicture3 = new ObjectID();
            const user = new UserModel({
                pictures: [
                    {
                        _id: idPicture1,
                        source: 'picture-1',
                    },
                    {
                        _id: idPicture2,
                        source: 'picture-2',
                    },
                    {
                        _id: idPicture3,
                        source: 'picture-3',
                    }
                ]
            });

            user.save().then((user) => {
                ProfileController.updateUserPictures(user, []).then((user) => {
                    expect(user.pictures).to.be.length(0);
                    done();
                });
            });
        });
    });

    describe('Update User notifications', () => {
        it('should update user notifications', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .put('/api/profile/notifications')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({
                        new_message: true,
                        new_game: true,
                        new_game_answer: false,
                        new_macaroon: false,
                        round_reminder: false,
                        selection_reminder: true,
                        new_favorite: false,
                        macaroon_accepted: false,
                        player_nearby: false,
                        signup_nearby: true,
                        company_updates: false,
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                            expect(user.notifications).to.be.an('object');
                            expect(user.notifications.new_message).to.be.true;
                            expect(user.notifications.new_game).to.be.true;
                            expect(user.notifications.new_game_answer).to.be.false;
                            expect(user.notifications.new_macaroon).to.be.false;
                            expect(user.notifications.round_reminder).to.be.false;
                            expect(user.notifications.selection_reminder).to.be.true;
                            expect(user.notifications.new_favorite).to.be.false;
                            expect(user.notifications.macaroon_accepted).to.be.false;
                            expect(user.notifications.player_nearby).to.be.false;
                            expect(user.notifications.signup_nearby).to.be.true;
                            expect(user.notifications.company_updates).to.be.false;
                            done();
                        });
                    });
            });
        })
    });

    describe('Update User Lairs', () => {
        it('should call the Lair service and update the user', (done) => {
            const postUserLairStub = sinon.stub(LairsService, 'postUserLairs').resolves([{
                placeId: 'pid1',
                name: 'Dummy lair',
                address: '4 rue de longchamps',
            }, {
                placeId: 'pid2',
                name: 'Dummy lair 2',
                address: '8 rue de longchamps',
            }]);
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {

                chai.request(server)
                    .put('/api/profile/lairs')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send([
                        'dummyId123'
                    ])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        UserModel.findOne({email: 'john.doe@dummy.com'}).then((user) => {
                            expect(user.lairs).to.be.length(2);
                            expect(user.lairs[0].name).to.be.equal('Dummy lair');
                            expect(user.lairs[1].name).to.be.equal('Dummy lair 2');
                            expect(postUserLairStub.calledOnce).to.be.true;
                            done();
                        });
                    });
            });
        })
    });

    describe('Update User Details', () => {
        it('should update the user', (done) => {
            Hydrators.init().then(() => {
                return UserModel.findOne({email: 'john.doe@dummy.com'});
            }).then((user) => {
                chai.request(server)
                    .put('/api/profile/details')
                    .set('Authorization', 'Bearer ' + user.generateJWT())
                    .send({
                        firstname: 'J',
                        lastname: 'G',
                        height: 180,
                        email: 'john.d@dummy.com',
                        date_of_birth: '2009-10-04T13:40:31Z',
                        bio: 'User bio short',
                        physical_activity: 0,
                        astrological_sign: 0,
                        alcohol_habits: 0,
                        smoking_habits: 0,
                        kids_expectation: 0,
                        religion: 0,
                        political_affiliation: 0,
                        locale: 'fr'
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        UserModel.findOne({email: 'john.d@dummy.com'}).then((user) => {
                            expect(user.firstname).to.be.equal('J');
                            expect(user.lastname).to.be.equal('G');
                            expect(user.height).to.be.equal(180);
                            expect(user.bio).to.be.equal('User bio short');
                            expect(user.physical_activity).to.be.equal(0);
                            expect(user.astrological_sign).to.be.equal(0);
                            expect(user.alcohol_habits).to.be.equal(0);
                            expect(user.smoking_habits).to.be.equal(0);
                            expect(user.kids_expectation).to.be.equal(0);
                            expect(user.religion).to.be.equal(0);
                            expect(user.political_affiliation).to.be.equal(0);
                            expect(user.locale).to.be.equal('fr');
                            done();
                        });
                    });
            });
        })
    });
});
