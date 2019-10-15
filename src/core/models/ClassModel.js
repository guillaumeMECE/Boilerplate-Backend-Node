const mongoose = require('mongoose');
const config = require('$root/config');
const { CustomError, errorsMessages } = require('$core');

/**
 * Smart Efficient Pagination: https://arpitbhayani.me/techie/fast-and-efficient-pagination-in-mongodb.html
 * (Skip is to CPU intensive: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js/23640287#23640287)
 */

function isPaginationInit(lastPaginateId) {

    return lastPaginateId !== config.PAGINATION_LAST_ID
    && lastPaginateId !== config.PAGINATION_INITIAL_ID;
}


function buildPaginateQuery(
    refDate,
    queryParam,
    dateField,
    reverse
) {

    const query = {};

    query[dateField] = {
        [reverse ? '$lt' : '$gt']: refDate,
    };
    
    return query;
}

async function createQueryWithoutPagination(modelName, query, dateField, reverse) {

    const queryEdit = { ...query };

    const refDate = reverse
        ? new Date(9900, 1, 1).getTime()
        : new Date(1, 1, 1).getTime();
            
    queryEdit[dateField] = {
        [reverse ? '$lte' : '$gte']: refDate,
    };
        
    const firstObjectFound = await mongoose.model(modelName)
        .findOne(queryEdit)
        .sort({ [dateField]: (reverse ? -1 : 1) })
        .exec();

            
    if (firstObjectFound) {

        const queryFindFromThisObject = { ...query };

        queryFindFromThisObject[dateField] = {
            [reverse ? '$lte' : '$gte']: firstObjectFound[dateField],
        };

        return queryFindFromThisObject;
    } 

    const impossibleQuery = queryEdit;

    return impossibleQuery;
}


async function createQueryWithPagination(modelName, query, lastPaginateId, dateField, reverse) {

    const queryEdit = { ...query };

    queryEdit._id = lastPaginateId;

    const objectTargeted = await mongoose.model(modelName)
        .findOne(queryEdit)
        .sort({ [dateField]: (reverse ? -1 : 1) })
        .exec();

    const queryFindAfterThisObject = { ...query };
    
    if (!objectTargeted) {
        throw new CustomError(errorsMessages.DataNotConform);
    }

    queryFindAfterThisObject[dateField] = {
        [reverse ? '$lt' : '$gt']: objectTargeted[dateField],
    };

    return queryFindAfterThisObject;
}
class ClassModel {

    constructor(modelName) {
        // Do not call it name because it will be overidden by loadClass
        this.modelName = modelName;
    }


    static async createQueryPaginate(query, lastPaginateId, option) {

        try {

            const { dateField, reverse } = option;
            
            console.log('lastpaginateid ', lastPaginateId);
            // We do not skip (=offset) for scalability reason: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js

            let result;

            if (!isPaginationInit(lastPaginateId)) {

                result = createQueryWithoutPagination(
                    this.modelName,
                    query,
                    option.dateField,
                    option.reverse
                );
            } else {

                result = createQueryWithPagination(
                    this.modelName,
                    query,
                    lastPaginateId,
                    option.dateField,
                    option.reverse
                );
            }

            return result;

        } catch (error) {
            throw new CustomError(errorsMessages.OperationError.ReadMany, error);
        }
    }
}

module.exports = ClassModel;
