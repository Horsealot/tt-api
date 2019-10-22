const AUTHORIZED_VALUES = {
    'M': [
        'm', 'male', 'man', 'men'
    ],
    'F': [
        'f', 'female', 'women', 'woman'
    ]
};

module.exports = {
    castGender: (value) => {
        // To be sure we use a String
        value = "" + value;
        for (let gender in AUTHORIZED_VALUES) {
            if (AUTHORIZED_VALUES[gender].indexOf(value.toLowerCase()) >= 0) return gender;
        }
        return null;
    },
    authorizedGenders: Object.keys(AUTHORIZED_VALUES)
};
