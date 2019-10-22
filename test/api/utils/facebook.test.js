process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const FacebookUtils = require('@api/utils/facebook');

describe('Facebook Utils', () => {
    it('should extract user email', (done) => {
        expect(FacebookUtils.extractEmail(
            {
                emails: [{value: 'john.doe@dummy.com'}]
            })).to.be.equal('john.doe@dummy.com');
        expect(FacebookUtils.extractEmail(
            {
                emails: [{value: ''}]
            })).to.be.null;
        expect(FacebookUtils.extractEmail(
            {
                emails: []
            })).to.be.null;
        expect(FacebookUtils.extractEmail({})).to.be.null;
        done();
    });
    it('Erase user email', (done) => {
        let fbProfile = {
            emails: [{value: 'john.doe@dummy.com'}]
        };
        FacebookUtils.eraseEmail(fbProfile);
        expect(FacebookUtils.extractEmail(fbProfile)).to.be.null;
        done();
    });
});
