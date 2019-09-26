const mime = require('mime-types');
const crypto = require('crypto');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = require('@api/services/s3');

const BUCKET_NAME = 'triktrak';
const NB_OF_DAYS_BEFORE_EXPIRATION = 7;

exports.userPictureUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: BUCKET_NAME,
        acl: 'private',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            crypto.pseudoRandomBytes(16, function (err, raw) {
                const prefix = 'pictures/' + (req.user ? req.user._id : 'general') + '/';
                cb(null, prefix + raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
            });
        }
    })
});

exports.generatePublicPicture = (key) => {
    const signedUrlExpireSeconds = 60 * 60 * 24 * NB_OF_DAYS_BEFORE_EXPIRATION; // 30 Days

    const url = s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: signedUrlExpireSeconds
    });
    var expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + NB_OF_DAYS_BEFORE_EXPIRATION);
    return {
        expired_at: expiredAt,
        public_source: url
    }
};

exports.refreshUserPublicPictures = (user) => {
    for (var i = 0; i < user.pictures.length; i++) {
        // Use exports. for unit tests
        user.pictures[i] = Object.assign(user.pictures[i], exports.generatePublicPicture(user.pictures[i].source));
    }
    return user;
};

module.exports = exports;
