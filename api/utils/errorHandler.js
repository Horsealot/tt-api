const Logger = require('@logger')('errorHandler.js');

const middleware = fn => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (e) {
        const {data: {reason = null} = {}} = e;
        Logger.error(`${fn.name}: {${e.message}|${reason}}`);
        Logger.debug(`${fn.name} error: {${e.stack}}`);
        res.status(503).json({code: reason});
    }
};

module.exports = middleware;
