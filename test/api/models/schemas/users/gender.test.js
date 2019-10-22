//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;

const {castGender, authorizedGenders} = require('@models/schemas/users/gender');

describe('Cast gender', () => {
    it('should return M for a male', (done) => {
        expect(castGender('m')).to.be.equal('M');
        expect(castGender('M')).to.be.equal('M');
        expect(castGender('maLe')).to.be.equal('M');
        expect(castGender('meN')).to.be.equal('M');
        expect(castGender('MAN')).to.be.equal('M');
        done();
    });
    it('should return F for a female', (done) => {
        expect(castGender('f')).to.be.equal('F');
        expect(castGender('F')).to.be.equal('F');
        expect(castGender('FemaLe')).to.be.equal('F');
        expect(castGender('WomaN')).to.be.equal('F');
        expect(castGender('WOMEN')).to.be.equal('F');
        done();
    });
    it('should return null for an unknown gender', (done) => {
        expect(castGender()).to.be.null;
        expect(castGender(null)).to.be.null;
        expect(castGender('')).to.be.null;
        expect(castGender(1)).to.be.null;
        expect(castGender('Femalemale')).to.be.null;
        done();
    });
});

describe('Authorized genders', () => {
    it('should return male and female', (done) => {
        expect(authorizedGenders).to.be.an('array').of.length(2);
        expect(authorizedGenders).to.contain('F');
        expect(authorizedGenders).to.contain('M');
        done();
    });
});
