"use strict";

const mongoose = require('mongoose');
require('./../../api/models');
const UserModel = mongoose.model('User');

module.exports = {
    init: () => {
        return UserModel.deleteMany({}).then(() => {
            const userActive1 = new UserModel({
                active: true,
                date_of_birth: new Date(),
                firstname: "John",
                lastname: "Doe",
                phone: 629290000,
                email: "john.doe@dummy.com",
                bio: "John Doe bio",
                gender: 'M',
                filters: {
                    min_age: 18,
                    max_age: 40,
                    max_distance: 100,
                    gender: 'F'
                },
                height: 180,
                locale: 'fr',
            });
            return userActive1.save();
        }).then(() => {
            const userActive2 = new UserModel({
                active: true,
                date_of_birth: new Date(),
                firstname: "Pat",
                lastname: "Hutson",
                facebookProvider: {
                    id: '1'
                },
                bio: "Pat Hutson bio",
                gender: 'M',
                filters: {
                    min_age: 18,
                    max_age: 40,
                    max_distance: 100,
                    gender: 'F'
                },
                height: 180,
                locale: 'fr',
            });
            return userActive2.save();
        });
    }
};
