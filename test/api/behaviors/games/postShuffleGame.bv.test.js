//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

require('module-alias/register');
require('dotenv').config({path: '.env.test'});

//Require the dev-dependencies
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const mongoose = require('mongoose');
const UserModel = mongoose.model('User');
const ConnectionModel = mongoose.model('Connection');
const ShuffleGameModel = mongoose.model('ShuffleGame');

const ShuffleGamesCache = require('@api/caches/shuffleGames.cache');
const {NotFoundError} = require('@api/errors');
const addToConversationBehavior = require('@api/behaviors/addToConversation.bv');
const messageTypes = require('@models/types/message');

const postShuffleGameBehavior = require('@api/behaviors/games/postShuffleGame.bv');

const Hydrator = require('./../../../hydrators');


describe('Post shuffle game behavior', () => {

    /**
     */
    afterEach(function () {
        sinon.restore();
    });

    it('should throw an NotFoundError if there is no cached game', (done) => {
        const getCachedGameStub = sinon.stub(ShuffleGamesCache, 'get').resolves(null);
        postShuffleGameBehavior.post(new ConnectionModel, new UserModel).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(err).to.be.an.instanceOf(NotFoundError);
            expect(getCachedGameStub.calledOnce).to.be.true;
            done();
        });
    });

    it('should throw an NotFoundError if the cached game does not link to an actual game', (done) => {
        const getCachedGameStub = sinon.stub(ShuffleGamesCache, 'get').resolves("Fake id");
        const findOneGameStub = sinon.stub(ShuffleGameModel, 'findOne').resolves(null);
        postShuffleGameBehavior.post(new ConnectionModel, new UserModel).then(() => {
            throw new Error('Invalid');
        }).catch((err) => {
            expect(err).to.be.an.instanceOf(NotFoundError);
            expect(getCachedGameStub.calledOnce).to.be.true;
            expect(findOneGameStub.calledOnce).to.be.true;
            done();
        });
    });

    it('should throw an NotFoundError if the cached game does not link to an actual game', (done) => {
        const game = new ShuffleGameModel({label: 'test q'});
        const addToConversationStub = sinon.stub(addToConversationBehavior, 'add').resolves();
        let getCachedGameStub;
        Hydrator.clean().then(() => {
            return game.save();
        }).then((game) => {
            getCachedGameStub = sinon.stub(ShuffleGamesCache, 'get').resolves(game._id);
            return postShuffleGameBehavior.post(new ConnectionModel, new UserModel);
        }).then((message) => {
            expect(message.type).to.be.equal(messageTypes.GAMING);
            return ShuffleGameModel.findOne({});
        }).then((game) => {
            expect(game.usage).to.be.equal(1);
            expect(getCachedGameStub.calledOnce).to.be.true;
            expect(addToConversationStub.calledOnce).to.be.true;
            done();
        });
    });

});
