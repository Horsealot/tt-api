const SpotifyService = require('@api/services/spotify');

module.exports = {
    linkUser: async (loggedInUser, code) => {
        try {
            const spotifyData = await SpotifyService.linkUser(loggedInUser.id, code);
            loggedInUser.spotify = {
                artists: spotifyData.artists,
                tracks: spotifyData.tracks
            };
            return await loggedInUser.save();
        } catch (e) {
            throw e;
        }
    },
    delinkUser: async (loggedInUser) => {
        try {
            await SpotifyService.delinkUser(loggedInUser.id);
            loggedInUser.spotify = null;
            return await loggedInUser.save();
        } catch (e) {
            throw e;
        }
    },
};
