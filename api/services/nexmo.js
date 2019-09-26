const {AuthError} = require('@api/errors');
const Logger = require('@api/utils/logger');

const Nexmo = require('nexmo');

const apiKey = process.env.NEXMO_API_KEY;
const apiSecret = process.env.NEXMO_API_SECRET;
if (!apiKey) throw new Error("Missing env variable NEXMO_API_KEY");
if (!apiSecret) throw new Error("Missing env variable NEXMO_API_SECRET");

const nexmo = new Nexmo({
    apiKey,
    apiSecret
});

const requestAuthCode = (phone) => {
    return new Promise((resolve, reject) => {
        Logger.debug(`nexmo.js\tRequest auth code {${phone}}`);
        nexmo.verify.request({number: phone, brand: 'TrikTrak'}, (err, result) => {
            if (err) return reject(err);
            if (result.status !== '0') {
                return reject(result);
            }
            resolve(result.request_id);
        });
    });
};

const authenticate = (requestId, code) => {
    Logger.debug(`nexmo.js\tAuthenticate by phone {${requestId},${code}}`);
    return new Promise((resolve, reject) => {
        // First we must retrieve the number by searching for the request
        // Search cannot be done after the check because the request disappear after the check
        nexmo.verify.search(requestId, (err, result) => {
            if (err) return reject(err);
            const number = result.number;
            nexmo.verify.check({request_id: requestId, code}, (err, result) => {
                if (err) return reject(err);
                if (result.status !== '0') {
                    return reject(result);
                }
                resolve(number);
            });
        });
    });
};

module.exports = {
    requestAuthCode: (phone) => {
        return requestAuthCode(phone).then((requestId) => {
            return requestId;
        }).catch((err) => {
            Logger.error(`nexmo.js\tError while requesting authCode {${err.status}%${err.message}}`);
            throw new AuthError(err);
        });
    },
    authenticate: (requestId, code) => {
        return authenticate(requestId, code).then((validatedPhoneNumber) => {
            return validatedPhoneNumber;
        }).catch((err) => {
            Logger.error(`nexmo.js\tError while validating phone number {${err.status}%${err.message}}`);
            throw new AuthError(err);
        });
    },
};
