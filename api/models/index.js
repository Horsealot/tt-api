'use strict';

const mongoose = require('mongoose');
const logger = require('./../utils/logger');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
if (!host) throw new Error("Missing env variable DB_HOST");
if (!port) throw new Error("Missing env variable DB_PORT");
if (!dbName) throw new Error("Missing env variable DB_NAME");

mongoose.connect(`mongodb://${host}:${port}/${dbName}`, {useNewUrlParser: true, useUnifiedTopology: true});

require('./schemas/user');

var db = mongoose.connection;
db.on('error', () => {
    logger.error(`DB\tDatabase connection error`);
    console.error.bind(console, 'DB\tconnection error:')
});
db.once('open', function () {
    logger.info(`DB\tDatabase MongoDb connected`);
});
