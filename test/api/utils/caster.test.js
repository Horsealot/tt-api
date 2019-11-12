process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');

const CasterUtils = require('@api/utils/caster');

describe('Caster Utils', () => {
    describe('to object id', () => {
        it('should convert strings', (done) => {
            expect(CasterUtils.toObjectId("5db2a7c1593f1f155df4c704")).to.be.a.instanceOf(mongoose.Types.ObjectId);
            done();
        });
        it('should not convert objectId', (done) => {
            expect(CasterUtils.toObjectId(mongoose.Types.ObjectId("5db2a7c1593f1f155df4c704"))).to.be.a.instanceOf(mongoose.Types.ObjectId);
            done();
        });
    });
});
