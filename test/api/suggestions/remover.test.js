//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const expect = chai.expect;
const {AuthError} = require('@api/errors');
const UserSessionModel = mongoose.model('UserSession');
const caster = require('@api/utils/caster');

const SuggestionsRemover = require('@api/suggestions/remover');

const createSessionStub = (suggestions) => {
    return new UserSessionModel({suggestions, user_id: caster.toObjectId('5db6c7ff88b0c6c2ad7476fe')});
};

describe('Suggestions remover', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    describe('Remove from session', () => {
        it('should return if no session is provided', (done) => {
            SuggestionsRemover.removeFromSession(null, 'fakeuserid');
            done();
        });
        it('should return if session has no suggestions', (done) => {
            const sessionStub = createSessionStub({});
            const rmSuggestionStub = sinon.stub(sessionStub, 'rmSuggestion').returns();
            const saveStub = sinon.stub(sessionStub, 'save').resolves();

            SuggestionsRemover.removeFromSession(sessionStub, 'fakeuserid');
            expect(rmSuggestionStub.calledOnce).to.be.false;
            expect(saveStub.calledOnce).to.be.false;
            done();
        });
        it('should return if session has no suggestions', (done) => {
            const sessionStub = createSessionStub({data: undefined});
            const rmSuggestionStub = sinon.stub(sessionStub, 'rmSuggestion').returns();
            const saveStub = sinon.stub(sessionStub, 'save').resolves();

            SuggestionsRemover.removeFromSession(sessionStub, 'fakeuserid');
            expect(rmSuggestionStub.calledOnce).to.be.false;
            expect(saveStub.calledOnce).to.be.false;
            done();
        });
        it('should remove the suggestion', (done) => {
            const sessionStub = createSessionStub({data: [caster.toObjectId('5db6c7ff88b0c6c2ad7476fe')]});
            const rmSuggestionStub = sinon.stub(sessionStub, 'rmSuggestion').returns();
            const saveStub = sinon.stub(sessionStub, 'save').resolves();

            SuggestionsRemover.removeFromSession(sessionStub, 'fakeuserid');
            expect(rmSuggestionStub.calledOnce).to.be.true;
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });
});
