process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const detailsValidator = require('@models/validators/users/details.validator');

describe('User details validator', () => {
    it('should fail on missing params', (done) => {
        expect(detailsValidator.validate({}).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            lastname: 'G',
            height: 180,
            email: 'john.doe@dummy.com',
            date_of_birth: '2009-10-04T13:40:31Z',
            bio: 'User bio short',
            physical_activity: 0,
            astrological_sign: 0,
            alcohol_habits: 0,
            smoking_habits: 0,
            kids_expectation: 0,
            religion: 0,
            political_affiliation: 0,
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            lastname: 'G',
            height: 180,
            email: 'john.doe@dummy.com',
            bio: 'User bio short',
            physical_activity: 0,
            astrological_sign: 0,
            alcohol_habits: 0,
            smoking_habits: 0,
            kids_expectation: 0,
            religion: 0,
            political_affiliation: 0,
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            lastname: 'G',
            height: 180,
            email: 'john.doe@dummy.com',
            date_of_birth: '2009-10-04T13:40:31Z',
            bio: 'User bio short',
            physical_activity: 0,
            astrological_sign: 0,
            alcohol_habits: 0,
            smoking_habits: 0,
            kids_expectation: 0,
            religion: 0,
            political_affiliation: 0,
        }).error).to.be.not.undefined;
        done();
    });
    it('should fail on bad params', (done) => {
        expect(detailsValidator.validate({
            firstname: 1,
            date_of_birth: '2009-10-04T13:40:31Z',
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            lastname: 2,
            date_of_birth: '2009-10-04T13:40:31Z',
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            height: 49,
            date_of_birth: '2009-10-04T13:40:31Z',
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            height: 'J',
            date_of_birth: '2009-1',
            locale: 'en'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            height: 180,
            locale: 'badlocale'
        }).error).to.be.not.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            height: 12.3,
            locale: 'fr'
        }).error).to.be.not.undefined;
        done();
    });
    it('should succeed on missing non mandatory params', (done) => {
        expect(detailsValidator.validate({
            firstname: 'J',
            date_of_birth: '2009-10-04T13:40:31Z',
            locale: 'en'
        }).error).to.be.undefined;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(detailsValidator.validate({
            firstname: 'J',
            lastname: 'G',
            height: 180,
            email: 'john.doe@dummy.com',
            date_of_birth: '2009-10-04T13:40:31Z',
            bio: 'User bio short',
            physical_activity: 0,
            astrological_sign: 0,
            alcohol_habits: 0,
            smoking_habits: 0,
            kids_expectation: 0,
            religion: 0,
            political_affiliation: 0,
            locale: 'en'
        }).error).to.be.undefined;
        expect(detailsValidator.validate({
            firstname: 'J',
            date_of_birth: '2009-10-04T13:40:31Z',
            locale: 'fr'
        }).error).to.be.undefined;
        done();
    });
});
