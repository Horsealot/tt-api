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
                location: {
                    type: 'Point',
                    coordinates: [-73.99279, 40.719296]
                },
                notifications: {
                    new_message: true,
                    new_game: true,
                    new_game_answer: true,
                    new_macaroon: true,
                    round_reminder: true,
                    selection_reminder: true,
                    new_favorite: true,
                    macaroon_accepted: true,
                    player_nearby: true,
                    signup_nearby: true,
                    company_updates: true,
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
                location: {
                    type: 'Point',
                    coordinates: [-73.99279, 40.719296]
                },
                height: 180,
                locale: 'fr',
            });
            return userActive2.save();
        }).then(() => {
            const userActive3 = new UserModel({
                active: true,
                date_of_birth: new Date(),
                firstname: "Pat",
                lastname: "Hutson",
                bio: "Pat Hutson bio",
                gender: 'F',
                filters: {
                    min_age: 18,
                    max_age: 40,
                    max_distance: 100,
                    gender: 'M'
                },
                location: {
                    type: 'Point',
                    coordinates: [-73.99279, 40.719296]
                },
                height: 180,
                locale: 'fr',
            });
            return userActive3.save();
        });
    }
};
