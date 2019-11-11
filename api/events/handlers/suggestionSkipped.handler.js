const suggestionsRemover = require('@api/suggestions/remover');

module.exports = {
    handle: async (from, to) => {
        await suggestionsRemover.removeFromUserSuggestions(from, to);
        await suggestionsRemover.removeFromUserSuggestions(to, from);
    }
};
