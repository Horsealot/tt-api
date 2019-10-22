process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const locationValidator = require('@models/validators/users/location.validator');

describe('User location validator', () => {
    it('should failed on missing params', (done) => {
        expect(locationValidator.validate({}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: 1}).error).to.be.not.undefined;
        expect(locationValidator.validate({lat: 1}).error).to.be.not.undefined;
        done();
    });
    it('should failed on bad params', (done) => {
        expect(locationValidator.validate({lng: "a", lat: 1}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: 1, lat: "a"}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: -180.1, lat: 0}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: 180.1, lat: 0}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: 0, lat: -90.01}).error).to.be.not.undefined;
        expect(locationValidator.validate({lng: 0, lat: 90.01}).error).to.be.not.undefined;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(locationValidator.validate({lng: 80.1, lat: 10.0002}).error).to.be.undefined;
        done();
    });
});
