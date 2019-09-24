'use strict';

const {createLogger, format, transports} = require('winston');

const {combine, timestamp, printf} = format;

const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp}\t${level}\t${message}`;
});

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console()]
});

module.exports = logger;

