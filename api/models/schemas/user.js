"use strict";

//Require Mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');

/**
 * Subdocuments
 */
const geopointSchema = require('./geopoint');
const jobsSchema = require('./users/jobs');
const studiesSchema = require('./users/studies');
const filtersSchema = require('./users/filters');

const DateUtils = require('../../utils/date');
const converter = require('./../converters');
const { locale } = require('./../../utils/locale');

var UserSchema = new Schema({
    active: Boolean,
    created_at: { type: Date, default: Date.now },
    last_updated_at: { type: Date, default: Date.now },
    date_of_birth: {
        type: Date
    },
    firstname: String,
    lastname: String,
    phone: Number,
    phone_indicative: String,
    email: String,
    hash: String,
    salt: String,
    bio: String,
    gender: {
        type: String,
        enum: ['M', 'F']
    },
    filters: {
        type: filtersSchema,
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
    pictures: [
        {
            created_at: { type: Date },
            link: String,
            order: Number
        }
    ],
    studies: [studiesSchema],
    jobs: [jobsSchema],
    lairs: [
        {
            title: String,
            institution: String,
            start_date: { type: Date },
            end_date: { type: Date }
        }
    ],
    physical_activity: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    astrological_sign: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    alcohol_habits: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    smoking_habits: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    kids_expectation: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    religion: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    },
    political_affiliation: {
        type: Number,
        min: 0,
        max: 2,
        validate : {
            validator : Number.isInteger,
        }
    }
});

UserSchema.pre('save', function(next) {
    this.last_updated_at = new Date();
    next();
});


/**
 * AUTH PART
 */

/**
 * Set user password
 * @param password
 */
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

/**
 * Validate user password
 * @param password
 * @returns {boolean}
 */
UserSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

/**
 * Generate user JWT
 * @returns {*}
 */
UserSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
};

/**
 * Override default toJSON
 * @returns {{_id: *, age: (*|number), firstname: *, bio: *, gender: *, height: *, locale: *, pictures: *, studies: null, jobs: null, lairs: *, physical_activity: *, astrological_sign: *, alcohol_habits: *, smoking_habits: *, kids_expectation: *, religion: *, political_affiliation: *}}
 */
UserSchema.methods.toJSON = function() {
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

module.exports = mongoose.model('User', UserSchema);
