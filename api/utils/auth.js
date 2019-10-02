const jwt = require('express-jwt');
const mongoose = require('mongoose');
const UsersModel = mongoose.model('User');
const Logger = require('@logger');
const TokenUtils = require('./token');

const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};


const auth = {
    required: jwt({
        secret: TokenUtils.tokenSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: TokenUtils.tokenSecret,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
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
