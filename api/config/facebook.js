const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

const clientID = process.env.FACEBOOK_CLIENT_ID;
const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
if (!clientID) throw new Error("Missing env variable FACEBOOK_CLIENT_ID");
if (!clientSecret) throw new Error("Missing env variable FACEBOOK_CLIENT_SECRET");

passport.use(new FacebookTokenStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    fbGraphVersion: 'v4.0',
    profileFields: ['id', 'displayName', 'name', 'emails', 'gender', 'friends', 'birthday']
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    return done(null, profile);
}));
