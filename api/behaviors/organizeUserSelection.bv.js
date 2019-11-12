const self = {
    // https://stackoverflow.com/a/37826698/2068565
    organizeByRounds: (suggestedUsers) => {
        const organizedSelections = suggestedUsers.reduce((organizedSelections, item, index) => {
            const chunkIndex = index < 4 ? 0 : Math.floor((index - 1) / 3);

            if (!organizedSelections[chunkIndex]) {
                organizedSelections[chunkIndex] = []; // start a new chunk
            }

            organizedSelections[chunkIndex].push(item);

            return organizedSelections;
        }, []);
        return organizedSelections;
    },
};

module.exports = self;
