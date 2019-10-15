module.exports = {

    // MODEL CONSTANT
    TO_BE_DEFINE_ON_CREATE: 'TO_BE_DEFINE_ON_CREATE',
    TO_BE_DEFINE_WITH_BEFORE_CREATE_TRANSFORMATION: 'TO_BE_DEFINE_WITH_BEFORE_CREATE_TRANSFORMATION',
    FILTER_ATTRIBUTE_LEVEL: { PUBLIC: 200, OWNER: 400, TRACK: 1500, SECRET: 2000 },

    // PAGINATION
    PAGINATION_INITIAL_ID: '111111111111111111111111', // works because 4-byte value representing the seconds since the Unix epoch
    PAGINATION_LAST_ID: 'ffffffffffffffffffffffff', // works because 4-byte value representing the seconds since the Unix epoch
    PAGINATION_DEFAULT_MAX_RESULT_PER_PAGE: 20,
    
    // PASSWORD CONFIG
    PASSWORD_SIZE: 6,
};
