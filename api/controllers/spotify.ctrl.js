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
};
