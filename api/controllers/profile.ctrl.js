const converter = require('@models/converters');

const {refreshUserPublicPictures} = require('@api/services/userPicture');
const Logger = require('@logger');
const UserResponse = require('@models/responses/user.response');
const ProfileResponse = require('@models/responses/profile.response');
const LairService = require('@api/services/lairs');

const UserCache = require('@api/caches/users.cache');

module.exports = {
    getProfile: (loggedInUser) => {
        if (loggedInUser.arePicturesExpired()) refreshUserPublicPictures(loggedInUser);
        return loggedInUser;
    },
    putNotifications: async (req, res) => {
        let user = req.user;
        user.notifications = req.body;
        try {
            await user.save();
            Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his notications`);
            res.send(new ProfileResponse(user));
        } catch (e) {
            Logger.error(`profile.ctrl.js\tputNotifications: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    putLairs: async (req, res) => {
        let user = req.user;
        try {
            user.lairs = await LairService.postUserLairs(user, req.body);
            await user.save();
            Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his lairs`);
            res.send(new ProfileResponse(user));
        } catch (e) {
            Logger.error(`profile.ctrl.js\tputLairs: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    putDetails: async (req, res) => {
        let user = req.user;
        for (let userProperties in req.body) {
            user[userProperties] = req.body[userProperties];
        }
        try {
            await user.save();
            Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his profile details`);
            await UserCache.set(user.id, new UserResponse(user));
            res.send(new ProfileResponse(user));
        } catch (e) {
            Logger.error(`profile.ctrl.js\tputLairs: {${e.message}}`);
            res.sendStatus(503);
        }
    },
    uploadPicture: async (user, picturePath, position) => {
        Logger.debug(`profile.ctrl.js\tUser ${user._id} uploaded a picture`);
        const uploadedPicture = {
            created_at: new Date(),
            source: picturePath
        };
        if (typeof position === "undefined" || (position - 1) === user.pictures.length || (position - 1) > user.pictures.length) {
            user.pictures.push(uploadedPicture);
        } else {
            user.pictures.splice((position - 1), 0, uploadedPicture);
        }
        refreshUserPublicPictures(user);
        return await user.save();
    },
    updateUserPictures: (user, pictures) => {
        let removed = [];
        // Extract removed pictures
        user.pictures = user.pictures.filter((picture) => {
            if (pictures.indexOf(picture.id) < 0) {
                removed.push(picture.source);
                return false;
            }
            return true;
        });
        if (removed.length) {
            Logger.debug(`profile.ctrl.js\tUser {${user.id}} removed ${removed.length} pictures > {${removed}}`);
        }
        let userPictures = [];
        // Reorder remaining pictures
        for (let i = 0; i < pictures.length; i++) {
            for (let j = 0; j < user.pictures.length; j++) {
                if (pictures[i] === user.pictures[j].id) {
                    userPictures.push(user.pictures[j]);
                }
            }
        }
        user.pictures = userPictures;
        return user.save();
    },
    updateUserFilters: async (user, filters) => {
        Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his filters`);
        user.filters = filters;
        return await user.save();
    },
    updateUserJobs: async (user, jobs) => {
        Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his jobs`);
        user.jobs = jobs;
        return await user.save();
    },
    updateUserStudies: async (user, studies) => {
        Logger.debug(`profile.ctrl.js\tUser ${user._id} updated his studies`);
        user.studies = studies;
        return await user.save();
    },
    getProfileNomenclature: () => {
        return converter.getProfileNomenclature();
    }
};
