"use strict";

//Require Mongoose
const mongoose = require('mongoose');
const {Schema} = mongoose;

/**
 * Subdocuments
 */
const geopointSchema = require('./geopoint');
const jobsSchema = require('./users/jobs');
const lairsSchema = require('./users/lairs');
const pictureSchema = require('./users/picture');
const studiesSchema = require('./users/studies');
const filtersSchema = require('./users/filters');
const spotifySchema = require('./users/spotify');
const notificationsSchema = require('./users/notifications');

const FacebookUtils = require('@api/utils/facebook');
const DateUtils = require('@api/utils/date');
const TokenUtils = require('@api/utils/token');
const converter = require('@models/converters');
const {locale} = require('./../../utils/locale');
const {castGender, authorizedGenders} = require("./users/gender");

var UserSchema = new Schema({
    active: Boolean,
    created_at: {type: Date, default: Date.now},
    last_updated_at: {type: Date, default: Date.now},
    last_login: {type: Date, default: Date.now},
    date_of_birth: {
        type: Date
    },
    firstname: String,
    lastname: String,
    phone: Number,
    email: {
        type: String, trim: true,
        unique: true, sparse: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    hash: String,
    salt: String,
    bio: String,
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    gender: {
        type: String,
        enum: authorizedGenders
    },
    filters: {
        type: filtersSchema,
        default: filtersSchema,
        required: true
    },
    location: geopointSchema,
    height: {
        type: Number,
        min: 0
    },
    locale: {
        type: String,
        enum: locale
    },
    pictures: [pictureSchema],
    studies: [studiesSchema],
    jobs: [jobsSchema],
    lairs: [lairsSchema],
    physical_activity: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    astrological_sign: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    alcohol_habits: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    smoking_habits: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    kids_expectation: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    religion: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    political_affiliation: {
        type: Number,
        min: 0,
        max: 2,
        validate: {
            validator: Number.isInteger,
        }
    },
    spotify: {
        type: spotifySchema
    },
    notifications: {
        type: notificationsSchema,
        default: notificationsSchema,
        required: true
    },
    duplicate_of: {
        type: Schema.Types.ObjectId
    }
});

UserSchema.pre('save', function (next) {
    this.last_updated_at = new Date();
    if (!this.email) this.email = undefined;
    next();
});

/**
 * Create or update user using his facebook data
 * @param profile
 * @returns {Promise<void>}
 */
UserSchema.statics.upsertFbUser = async function (profile) {
    let user = await this.findOne({'facebookProvider.id': profile.id});
    let fbMail = FacebookUtils.extractEmail(profile);
    let emailUser = await this.findOne({'email': fbMail});
    // If we have no user for this FB Account
    if (!user) {
        // We create a new one
        user = new this();
        // Unless the fb email is linked to an user, in that case we link the fb account to this account
        if (emailUser) {
            user = emailUser;
        }
    }
    user.setFromFacebook(profile);
    await user.save();
    return user;
};

/**
 * Update user using his facebook data
 * If data is already filled, we do not erase it using the one provided by Facebook
 * @param fbProfile
 */
UserSchema.methods.setFromFacebook = function (fbProfile) {
    let fbMail = FacebookUtils.extractEmail(fbProfile);
    if (!this.email && fbMail) {
        this.email = fbProfile.emails[0].value;
    }
    this.facebookProvider = {
        id: fbProfile.id,
        token: fbProfile.accessToken,
        refreshToken: fbProfile.refreshToken
    };
    this.firstname = this.firstname ? this.firstname : fbProfile.name.givenName;
    this.lastname = this.lastname ? this.lastname : fbProfile.name.familyName;
    this.gender = this.gender ? this.gender : castGender(fbProfile.gender);
    if (!this.date_of_birth && fbProfile._json.birthday) {
        this.date_of_birth = Date.parse(fbProfile._json.birthday + ' 12:00:00');
    }
};


/**
 * AUTH PART
 */

/**
 * Set user password
 * @param password
 */
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

/**
 * Validate user password
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

/**
 * Generate user JWT
 * @returns {*}
 */
UserSchema.methods.generateJWT = function () {
    return TokenUtils.generateUserToken(this);
};

/**
 * Generate user JWT
 * @returns {*}
 */
UserSchema.methods.generateInternalJWT = function () {
    return TokenUtils.generateInternalUserToken(this);
};

/**
 * Are user public pictures expired (within the next 7 days)
 * @returns {boolean}
 */
UserSchema.methods.arePicturesExpired = function () {
    for (var i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].expired_at <= new Date()) return true;
    }
    return false;
};

/**
 * Override default toJSON
 * @returns {{_id: *, age: (*|number), firstname: *, bio: *, gender: *, height: *, locale: *, pictures: *, studies: null, jobs: null, lairs: *, physical_activity: *, astrological_sign: *, alcohol_habits: *, smoking_habits: *, kids_expectation: *, religion: *, political_affiliation: *}}
 */
UserSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        age: this.date_of_birth ? DateUtils.getUserAge(this.date_of_birth) : null,
        firstname: this.firstname,
        bio: this.bio,
        gender: this.gender,
        // location: geopointSchema,
        height: this.height,
        locale: this.locale,
        pictures: this.pictures,
        studies: this.studies.length > 0 ? this.studies[0] : null,
        jobs: this.jobs.length > 0 ? this.jobs[0] : null,
        lairs: this.lairs,
        physical_activity: converter.getPhysicalActivity(this.physical_activity),
        astrological_sign: this.astrological_sign,
        alcohol_habits: this.alcohol_habits,
        smoking_habits: this.smoking_habits,
        kids_expectation: this.kids_expectation,
        religion: this.religion,
        political_affiliation: this.political_affiliation
    };
};

UserSchema.methods.toAuthJSON = function () {
    return {
        ...this.toJSON(),
        accessToken: this.generateJWT()
    };
};

module.exports = mongoose.model('User', UserSchema);
