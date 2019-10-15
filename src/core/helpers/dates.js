const moment = require('moment-timezone');

module.exports = { 
    
    isValidPeriod: (startDate, endDate) => {
        return startDate && endDate
            && moment(startDate, 'YYYY-MM-DD', true).isValid()
            && moment(endDate, 'YYYY-MM-DD', true).isValid()
            && moment(startDate).isBefore(endDate);
    },
};
