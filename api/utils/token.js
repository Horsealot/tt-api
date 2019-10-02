const jwt = require('jsonwebtoken');

const TOKEN = process.env.TOKEN_SECRET;
if (!TOKEN) throw new Error("Missing env variable TOKEN_SECRET");

const auth = {
    tokenSecret: TOKEN,
    generateUserToken: (user) => {
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);

        return jwt.sign({
            id: user._id,
            exp: parseInt(expirationDate.getTime() / 1000, 10),
        }, TOKEN);
    }
};

module.exports = auth;
