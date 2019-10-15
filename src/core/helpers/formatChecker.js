const _ = require('lodash');

const rigorousConfig = require('../config');

function getAge(DOB) {
    const today = new Date();
    const birthDate = new Date(DOB);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }    
    return age;
}

module.exports = {
    
    isEmail: (email) => {
        /* eslint no-useless-escape: 0 */
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
        return regex.test(email);
    },

    isPassword: (string) => {
        return string.length >= rigorousConfig.PASSWORD_SIZE;
    },

    isUsername: (string) => {
        return string.charAt(0) === string.charAt(0).toUpperCase();
    },
    
    isFirstLetterCapitalized: (string) => {
        return string.charAt(0) === string.charAt(0).toUpperCase();
    },
    
    isBirthdate: (birthdate) => {
        return getAge(birthdate) > 18;
    },
    
    isNil: (v) => {
        return _.isNil(v);
    },
    
    isEmptyString: (v) => {
        return v === '';
    },

    isAttributeDefined: (attr, v) => {
        return typeof v.attr !== 'undefined';
    },

    isObjectEmpty(obj) {
        return _.isEmpty(obj);
    },
};
