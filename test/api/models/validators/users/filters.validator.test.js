process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;

const usersFiltersValidator = require('@models/validators/users/filters.validator');

describe('User filters validator', () => {
    it('should failed on missing params', (done) => {
        expect(usersFiltersValidator.validate({}).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({max_age: 80, max_distance: 10, gender: 'M'}).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({min_age: 18, max_distance: 10, gender: 'M'}).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({min_age: 18, max_age: 80, gender: 'M'}).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({min_age: 18, max_age: 80, max_distance: 10}).error).to.be.not.undefined;
        done();
    });
    it('should failed on bad params', (done) => {
        expect(usersFiltersValidator.validate({
            min_age: 17,
            max_age: 80,
            max_distance: 10,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 101,
            max_distance: 10,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 80,
            max_distance: 4,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 80,
            max_distance: 181,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 80,
            max_distance: 10,
            gender: 'A'
        }).error).to.be.not.null;
        expect(usersFiltersValidator.validate({
            min_age: 18.1,
            max_age: 80,
            max_distance: 10,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 80.2,
            max_distance: 10,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 80,
            max_distance: 10.1,
            gender: 'M'
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 'a',
            max_age: 'b',
            max_distance: 'c',
            gender: 10
        }).error).to.be.not.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 20,
            max_age: 18,
            max_distance: 5,
            gender: 'M'
        }).error).to.be.not.undefined;
        done();
    });
    it('should succeed on good params', (done) => {
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 18,
            max_distance: 5,
            gender: 'M'
        }).error).to.be.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 100,
            max_age: 100,
            max_distance: 180,
            gender: 'M'
        }).error).to.be.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 18,
            max_distance: 5,
            gender: 'F'
        }).error).to.be.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 100,
            max_age: 100,
            max_distance: 180,
            gender: 'F'
        }).error).to.be.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 18,
            max_age: 18,
            max_distance: 5,
            gender: 'B'
        }).error).to.be.undefined;
        expect(usersFiltersValidator.validate({
            min_age: 100,
            max_age: 100,
            max_distance: 180,
            gender: 'B'
        }).error).to.be.undefined;
        done();
    });
});
