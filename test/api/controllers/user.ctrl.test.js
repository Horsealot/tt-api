//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const sinon = require('sinon');

require('@models');

//Our parent block
describe('User Controller', () => {

    afterEach(() => {
        sinon.restore();
    });

    // TODO
});
