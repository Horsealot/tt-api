const jwt = require('express-jwt');
const blacklist = require('express-jwt-blacklist');
const mongoose = require('mongoose');
const UsersModel = mongoose.model('User');
const Logger = require('@logger');
const TokenUtils = require('./token');

const host = process.env.BLACKLIST_HOST;
const port = process.env.BLACKLIST_PORT;
const password = process.env.BLACKLIST_PASSWORD;
if (!host) throw new Error("Missing env variable BLACKLIST_HOST");
if (!port) throw new Error("Missing env variable BLACKLIST_PORT");
if (!password) throw new Error("Missing env variable BLACKLIST_PASSWORD");

blacklist.configure({
    tokenId: 'jti',
    strict: false,
    store: {
        type: 'redis',
        host,
        port,
        keyPrefix: 'triktrak-api-jwt-blacklist:',
        options: {
            password
        }
    }
});

const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};


const auth = {
    revoke: (payload, callback) => {
        blacklist.revoke(payload, undefined, callback);
    },
    required: jwt({
        secret: TokenUtils.tokenSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        isRevoked: blacklist.isRevoked
    }),
    optional: jwt({
        secret: TokenUtils.tokenSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
        isRevoked: blacklist.isRevoked
    }),
    loadUser: (req, res, next) => {
        const {payload: {id}} = req;
        UsersModel.findOne({_id: id}).then((user) => {
            if (!user) {
                return res.sendStatus(400);
            }
            req.user = user;
            next();
        }).catch((err) => {
            Logger.error(`auth.js\tLoad user failed: ${err.message}`);
            return res.sendStatus(400);
        });
    }
};

module.exports = auth;
