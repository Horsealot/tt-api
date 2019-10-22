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
        return UsersModel.findOne({_id: id}).then((user) => {
            if (!user) {
                res.sendStatus(401);
            } else {
                req.user = user;
                next();
            }
        }).catch((err) => {
            Logger.error(`auth.js\tLoad user failed: ${err.message}`);
            res.sendStatus(400);
        });
    },
    isUserAllowed: (req, res, next) => {
        const {user} = req;
        if(!user) {
            Logger.error(`auth.js\tisUserAllowed must be used after loadUser`);
            return res.sendStatus(500);
        }
        if(user.status.locked) {
            Logger.info(`auth.js\tUser is not allowed to access this API`);
            return res.sendStatus(401);
        }
        next();
    }
};

module.exports = auth;
