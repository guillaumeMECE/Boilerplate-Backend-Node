import moment from 'moment-timezone';

const CustomError = require('../errors/CustomError');
const errorsMessages = require('../errors/errorsMessages');

const helperDates = require('./dates');

module.exports = {

    parseTimezone: (req) => {
        const timezone = req.header('Timezone');

        if (!timezone) {
            throw new CustomError(errorsMessages.MissingTimezoneHeaderError);
        } else if (moment.tz.zone(timezone) === null) {
            throw new CustomError(errorsMessages.InvalidTimezoneHeaderError);
        }

        return timezone;
    },

    parsePeriod: (req) => {
        const period = {};
        const startDate = req.query.start;
        const endDate = req.query.end;
        const timezone = req.header('Timezone');

        if (helperDates.isValidPeriod(startDate, endDate)) {
            period.startDate = moment(startDate).startOf('day').tz(timezone).toDate();
            period.endDate = moment(endDate).endOf('day').tz(timezone).toDate();
        } else {
            period.startDate = moment().startOf('day').tz(timezone).subtract(1, 'month').toDate();
            period.endDate = moment().endOf('day').tz(timezone).subtract(1, 'day').toDate();
        }

        return period;
    },

    parseBirthday: (req) => {
        const minValue = 1;
        const maxValue = 99;

        const ageRange = req.query.age;
        const timezone = req.header('Timezone');

        let rangeValues = null;

        if (ageRange) {
            rangeValues = ageRange.split('-');
        }

        if (rangeValues !== null && rangeValues.length === 2) {
            const minAge = (rangeValues[0] === 'min') ? minValue : parseInt(rangeValues[0], 10);
            const maxAge = (rangeValues[1] === 'max') ? maxValue : parseInt(rangeValues[1], 10);

            if (Number.isInteger(minAge) && Number.isInteger(maxAge) && minAge <= maxAge && minValue <= maxValue && minAge <= maxAge) {
                const birthdayMinDate = moment().startOf('day').tz(timezone).subtract(maxAge, 'years').format();
                const birthdayMaxDate = moment().endOf('day').tz(timezone).subtract(minAge, 'years').format();
                
                return {
                    startDate: birthdayMinDate,
                    endDate: birthdayMaxDate,
                };
            }
        }

        return null;
    },

    parseGender: (req) => {
        const { gender } = req.query;

        if (gender === 'male' || gender === 'female') {
            return gender;
        }

        return null;
    },
};
