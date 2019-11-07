const suggestionsRemover = require('@api/suggestions/remover');

module.exports = {
    handle: (from, to) => {
        suggestionsRemover.removeFromUserSuggestions(from, to);
        suggestionsRemover.removeFromUserSuggestions(to, from);
    }
};
