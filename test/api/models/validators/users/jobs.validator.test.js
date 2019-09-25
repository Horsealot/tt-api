process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const jobsFiltersValidator = require('@models/validators/users/jobs.validator');

describe('User filters validator', () => {
    it('should failed on missing params', (done) => {
        expect(jobsFiltersValidator.validate({}).error).to.be.not.null;
        expect(jobsFiltersValidator.validate([{}]).error).to.be.not.null;
        expect(jobsFiltersValidator.validate([{title: 'Community Manager'}]).error).to.be.not.null;
        expect(jobsFiltersValidator.validate([{institution: 'Community Manager'}]).error).to.be.not.null;
        done();
    });
    it('should failed on bad params', (done) => {
        expect(jobsFiltersValidator.validate([{title: 'Community Manager', institution: 11}]).error).to.be.not.null;
        expect(jobsFiltersValidator.validate([{title: 12, institution: 'TrikTrak'}]).error).to.be.not.null;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(jobsFiltersValidator.validate([]).error).to.be.undefined;
        expect(jobsFiltersValidator.validate([{
            title: 'Community Manager',
            institution: 'Trik Trak'
        }]).error).to.be.undefined;
        expect(jobsFiltersValidator.validate([
            {
                title: 'Community Manager',
                institution: 'Trik Trak'
            },
            {
                title: 'Intern',
                institution: 'Linkedin'
            }
        ]).error).to.be.undefined;
        done();
    });
});
