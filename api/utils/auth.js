const jwt = require('express-jwt');
const mongoose = require('mongoose');
const UsersModel = mongoose.model('User');

const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;

    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }
    return null;
};


const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
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
            console.log(err);
            return res.sendStatus(400);
        });
    },
};

module.exports = auth;
