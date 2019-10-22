module.exports = {
    /**
     * Get user age from birthday
     * @param birthday
     * @returns {number}
     */
    getUserAge: (birthday) => {
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
};
