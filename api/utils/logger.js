'use strict';

const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple()
});
logger.add(new winston.transports.Console({
    format: winston.format.simple()
}));

module.exports = logger;
