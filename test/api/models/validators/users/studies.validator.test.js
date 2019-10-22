process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const studiesFiltersValidator = require('@models/validators/users/studies.validator');

describe('User studies validator', () => {
    it('should failed on missing params', (done) => {
        expect(studiesFiltersValidator.validate({}).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{}]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{graduation_date: '2008-09-15T15:53:00'}]).error).to.be.not.undefined;
        done();
    });
    it('should failed on bad params', (done) => {
        expect(studiesFiltersValidator.validate([{title: 11}]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{institution: 11}]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{
            title: 'Engineering degree',
            institution: 11
        }]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{title: 12, institution: 'ECAM'}]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{
            title: 'Engineering degree',
            institution: 'ECAM',
            graduation_date: 11
        }]).error).to.be.not.undefined;
        expect(studiesFiltersValidator.validate([{
            title: 'Engineering degree',
            institution: 'ECAM',
            graduation_date: '2019'
        }]).error).to.be.not.null;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(studiesFiltersValidator.validate([]).error).to.be.undefined;
        expect(studiesFiltersValidator.validate([{title: 'Engineering degree'}]).error).to.be.undefined;
        expect(studiesFiltersValidator.validate([{institution: 'ECAM'}]).error).to.be.undefined;
        expect(studiesFiltersValidator.validate([{
            title: 'Engineering degree',
            institution: 'ECAM'
        }]).error).to.be.undefined;
        expect(studiesFiltersValidator.validate([{
            title: 'Engineering degree',
            institution: 'ECAM',
            graduation_date: '2008-09-15T15:53:00'
        }]).error).to.be.undefined;
        expect(studiesFiltersValidator.validate([
            {
                title: 'Engineering degree',
                institution: 'ECAM',
                graduation_date: '2008-09-15T15:53:00'
            },
            {
                title: 'Intern',
                institution: 'ECAM'
            }
        ]).error).to.be.undefined;
        done();
    });
});
