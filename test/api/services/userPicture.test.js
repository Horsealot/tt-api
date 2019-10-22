//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');

require('@models');
const UserModel = mongoose.model('User');

const UserPictureService = require('@api/services/userPicture');
const s3 = require('@api/services/s3');

describe('User picture service', () => {

    /**
     * Restore s3 stub
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Generate Public Picture', () => {
        it('should generate a public url using s3 getSignedUrl', (done) => {
            const expectedDay = new Date();
            expectedDay.setDate(expectedDay.getDate() + 7);
            const getSignedUrlStub = sinon.stub(s3, 'getSignedUrl').returns('public_url');
            const publicPicture = UserPictureService.generatePublicPicture('private_url');
            expect(publicPicture).to.be.an('object');
            expect(publicPicture).to.have.property('public_source').equal('public_url');
            expect(publicPicture).to.have.property('expired_at');
            expect(publicPicture.expired_at).to.be.an('date');
            expect(publicPicture.expired_at.getDate()).to.be.equal(expectedDay.getDate());
            expect(getSignedUrlStub.calledOnce).to.be.true;
            done();
        });
    });

    describe('Generate Public Picture', () => {
        it('should user public pictures', (done) => {
            const expectedDay = new Date();
            expectedDay.setDate(expectedDay.getDate() + 7);
            const generatePublicPictureStub = sinon.stub(UserPictureService, 'generatePublicPicture').throws(new Error("dd"));
            generatePublicPictureStub.withArgs('url1').returns({
                public_source: 'public_url1',
            });
            generatePublicPictureStub.withArgs('url2').returns({
                public_source: 'public_url2',
            });
            generatePublicPictureStub.withArgs('url3').returns({
                public_source: 'public_url3',
            });
            const user = new UserModel({
                pictures: [
                    {
                        source: 'url2',
                    },
                    {
                        source: 'url1',
                    },
                    {
                        source: 'url3',
                    }
                ]
            });

            UserPictureService.refreshUserPublicPictures(user);
            expect(user.pictures).to.be.an('array').of.length(3);
            expect(user.pictures[0].public_source).to.be.equal('public_url2');
            expect(user.pictures[1].public_source).to.be.equal('public_url1');
            expect(user.pictures[2].public_source).to.be.equal('public_url3');
            expect(generatePublicPictureStub.calledThrice).to.be.true;
            done();
        });
    });
});
