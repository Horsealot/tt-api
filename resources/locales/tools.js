module.exports = {
    /**
     * Prefix keys of a json object with 'prefix.'
     * @param values
     * @param prefix
     * @returns {{}}
     */
    prefixTranslations: (values, prefix) => {
        return Object.keys(values).reduce((p, c) => ({...p, [prefix + '.' + c]: values[c]}), {})
    }
};