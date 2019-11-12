//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const UserSessionModel = mongoose.model('UserSession');
const expect = chai.expect;

const SessionsCache = require('@api/caches/sessions.cache');
const EngineService = require('@api/suggestions/engine');
const Hydrators = require('../../hydrators');

describe('Engine service', () => {

    /**
     * Restore stub
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Get user suggestions', () => {
        it('should refresh the suggestions if there is no cached suggestions', (done) => {
            Hydrators.init().then((user) => {
                const getCachedSession = sinon.stub(SessionsCache, 'get').resolves(null);
                const setSessionInCache = sinon.stub(SessionsCache, 'set').resolves(null);
                const sessionModelStub = sinon.stub(UserSessionModel, 'findOne').resolves(null);
                EngineService.getUserSuggestions(user, '5db85f92593f1f155df4cec5').then((suggestions) => {
                    expect(getCachedSession.calledOnce).to.be.true;
                    expect(setSessionInCache.calledOnce).to.be.true;
                    expect(sessionModelStub.calledOnce).to.be.true;
                    done();
                });
            });
        });
        it('should return the cached suggestions', (done) => {
            Hydrators.init().then((user) => {
                const getCachedSession = sinon.stub(SessionsCache, 'get').resolves([user.id]);
                const setSessionInCache = sinon.stub(SessionsCache, 'set').resolves(null);
                const sessionModelStub = sinon.stub(UserSessionModel, 'findOne').resolves(null);
                EngineService.getUserSuggestions(user, '5db85f92593f1f155df4cec5').then((suggestions) => {
                    expect(getCachedSession.calledOnce).to.be.true;
                    expect(setSessionInCache.calledOnce).to.be.false;
                    expect(sessionModelStub.calledOnce).to.be.false;
                    done();
                });
            });
        });
    });
});
