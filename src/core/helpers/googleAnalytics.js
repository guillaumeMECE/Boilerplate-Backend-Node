const moment = require('moment-timezone');

module.exports = {

    formatPeriod: (period, timezone) => {
        const formatedPeriod = {};

        // Format start and end dates for Google Analytics API
        formatedPeriod.startDate = moment(period.startDate).tz(timezone).format('YYYY-MM-DD');
        formatedPeriod.endDate = moment(period.endDate).tz(timezone).format('YYYY-MM-DD');

        return formatedPeriod;
    },

    extractDatasetFromReport: (report) => {
        const GADataset = report.data.reports[0].data.rows;

        const dataset = [];

        if (GADataset) {
            GADataset.forEach((element) => {
                const date = moment(element.dimensions[0]).format('YYYY-MM-DD');
                const value = Number.parseFloat(element.metrics[0].values[0], 10);

                if (!Number.isNaN(value)) {
                    dataset.push({
                        'date': date,
                        'value': value
                    });
                }
            });
        }
        
        return dataset;
    },

    // Formatting array of ints to strings for Google Analytics
    convertToString: (dataset) => {
        return dataset.map(elem => elem.toString()); 
    }
};
