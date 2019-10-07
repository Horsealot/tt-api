const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const token = process.env.TOKEN_SECRET;
if (!token) throw new Error("Missing env variable TOKEN_SECRET");

const internalToken = process.env.INTERNAL_TOKEN_SECRET;
if (!internalToken) throw new Error("Missing env variable INTERNAL_TOKEN_SECRET");

const auth = {
    tokenSecret: token,
    /**
     * Generate a JWT Token for external API access
     * @param user
     * @returns {*}
     */
    generateUserToken: (user) => {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            id: user._id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, token, {
            jwtid: uuidv4()
        });
    },
    /**
     * Generate a JWT Token for internal call between services
     * @param user
     * @returns {*}
     */
    generateInternalUserToken: (user) => {
        return jwt.sign({
            id: user._id,
        }, internalToken);
    }
};

module.exports = auth;
