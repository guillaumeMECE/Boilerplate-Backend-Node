/* eslint-disable no-param-reassign */
const RigorousError = require('../errors/RigorousError');
const errorsMessages = require('../errors/errorsMessages');

/**
 * Provides functions to deal with datasets created inside backoffice analytics routes.
 */
module.exports = {

    /**
     * Returns the sum of all values
     */
    getTotal: (dataset) => {

        let total = 0;

        dataset.forEach((element) => {
            const value = Number.parseFloat(element.value, 10);

            if (Number.isNaN(value)) {
                throw new RigorousError(errorsMessages.InvalidDatasetElementValueError);
            } else {
                total += value;
            }
        });

        return total;
    },

    /**
     * Merge all duplicates
     */
    reduce: (dataset) => {

        for (let i = 0; i < dataset.length; i += 1) {
            for (let j = 0; j < dataset.length; j += 1) {
                if (i !== j) {
                    if (dataset[i].date === dataset[j].date) {
                        dataset[i].value += dataset[j].value;
                        dataset.splice(j, 1);
                    }
                }
            }
        }
    },

    /**
     * Sort in chronological order
     */
    sort: (dataset) => {

        dataset.sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    /**
     * Merge two datasets together
     */
    merge(dataset1, dataset2) {

        const mergedDataset = dataset1.concat(dataset2);

        this.reduce(mergedDataset);

        this.sort(mergedDataset);

        return mergedDataset;
    },
};
