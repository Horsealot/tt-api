process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;

const PictureResponse = require('@models/responses/users/picture.response');

describe('Profile Response', () => {

    it('should return only the public source and expiration date', (done) => {
        const pictureResponse = new PictureResponse({
            created_at: new Date(),
            expired_at: new Date(),
            source: 'private_source',
            public_source: 'public_source',
        });
        expect(pictureResponse).to.be.an('object');
        expect(pictureResponse).to.not.have.property('created_at');
        expect(pictureResponse).to.not.have.property('public_source');
        expect(pictureResponse).to.have.property('id');
        expect(pictureResponse).to.have.property('source').equal('public_source');
        expect(pictureResponse).to.have.property('expired_at');
        done();
    });
});
