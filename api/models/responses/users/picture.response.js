class PictureResponse {
    constructor(picture) {
        this.id = picture._id;
        this.source = picture.public_source;
        this.expired_at = picture.expired_at;
    }
}

module.exports = PictureResponse;
