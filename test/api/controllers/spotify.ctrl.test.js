//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const SpotifyController = require('@api/controllers/spotify.ctrl');
const SpotifyService = require('@api/services/spotify');

const Hydrators = require('./../../hydrators');

require('@models');
const UserModel = mongoose.model('User');

//Our parent block
describe('Spotify Controller', () => {

    beforeEach((done) => {
        Hydrators.init().then(() => {
            done();
        });
    });
    afterEach(() => {
        sinon.restore();
    });

    /*
    * Test the get Profile Nomenclature
    */
    describe('Link user', () => {
        it('should fail on a Spotify exception', (done) => {
            const linkUserStub = sinon.stub(SpotifyService, 'linkUser').throws(new Error(''));
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                try {
                    SpotifyController.linkUser(user, 'WRONG_CODE');
                    expect(false).to.be.true;
                } catch (e) {
                    expect(linkUserStub.calledOnce).to.be.true;
                    done();
                }
            });
        });
        it('should save and return a user and its tracks and artists', (done) => {
            const linkUserStub = sinon.stub(SpotifyService, 'linkUser').returns({
                tracks: [
                    {
                        name: 'Track1',
                        url: 'url1'
                    },
                    {
                        name: 'Track2',
                        url: 'url2'
                    },
                ],
                artists: [
                    {
                        name: 'Artist1',
                        url: 'url-a-1'
                    },
                    {
                        name: 'Artist2',
                        url: 'url-a-2'
                    }
                ]
            });
            UserModel.findOne({email: 'john.doe@dummy.com'}, (err, user) => {
                SpotifyController.linkUser(user, 'WRONG_CODE').then((user) => {
                    expect(linkUserStub.calledOnce).to.be.true;
                    expect(user.spotify.tracks).to.be.an('array').of.length(2);
                    expect(user.spotify.tracks[0]).to.be.an('object');
                    expect(user.spotify.tracks[0]).to.have.property('name').equal('Track1');
                    expect(user.spotify.tracks[0]).to.have.property('url').equal('url1');
                    expect(user.spotify.tracks[1]).to.have.property('name').equal('Track2');
                    expect(user.spotify.tracks[1]).to.have.property('url').equal('url2');
                    UserModel.findOne({email: 'john.doe@dummy.com'}, (err, dbUser) => {
                        expect(dbUser.spotify.tracks[0]).to.have.property('name').equal('Track1');
                        expect(dbUser.spotify.tracks[0]).to.have.property('url').equal('url1');
                        expect(dbUser.spotify.tracks[1]).to.have.property('name').equal('Track2');
                        expect(dbUser.spotify.tracks[1]).to.have.property('url').equal('url2');
                        done();
                    });
                })
            });
        });
    });
});
