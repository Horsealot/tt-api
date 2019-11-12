process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
const mongoose = require('mongoose');
require('@models');

const SessionModel = mongoose.model('Session');
const SessionResponse = require('@models/responses/session.response');

describe('Session Response', () => {
    it('should work for a session in progress', (done) => {
        const startDate = moment().subtract(1, 'hours');
        const endDate = moment().add(1, 'hours');
        const sessionResponse = new SessionResponse(new SessionModel({
            start_at: startDate,
            end_at: endDate,
        }), true);
        expect(sessionResponse.start_at).to.be.eql(new Date(startDate));
        expect(sessionResponse.end_at).to.be.eql(new Date(endDate));
        expect(sessionResponse.in_progress).to.be.true;
        expect(sessionResponse.previous_selection_completed).to.be.true;
        expect((new SessionResponse(new SessionModel({
            start_at: startDate,
            end_at: endDate,
        }), false)).previous_selection_completed).to.be.false;
        done();
    });
    it('should work for a session in progress', (done) => {
        const startDate = moment().subtract(2, 'days');
        const endDate = moment().subtract(1, 'days');
        const sessionResponse = new SessionResponse(new SessionModel({
            start_at: startDate,
            end_at: endDate,
        }), true);
        expect(sessionResponse.start_at).to.be.eql(new Date(startDate));
        expect(sessionResponse.end_at).to.be.eql(new Date(endDate));
        expect(sessionResponse.in_progress).to.be.false;
        expect(sessionResponse.previous_selection_completed).to.be.true;
        expect((new SessionResponse(new SessionModel({
            start_at: startDate,
            end_at: endDate,
        }), false)).previous_selection_completed).to.be.false;
        done();
    });
});
