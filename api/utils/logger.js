const {createLogger, format, transports} = require('winston');

const {combine, timestamp, printf} = format;

const level = process.env.LOGGER_LEVEL ? process.env.LOGGER_LEVEL : 'info';

const buildLogger = (prefix) => {
    return createLogger({
        level: level,
        format: combine(
            timestamp(),
            printf(({level, message, label, timestamp}) => {
                return `${timestamp}\t${level}\t${prefix}\t${message}`;
            })
        ),
        transports: [new transports.Console()]
    });
};

module.exports = (loggerPrefix) => buildLogger(loggerPrefix);

