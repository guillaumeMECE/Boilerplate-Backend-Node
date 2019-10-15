const mongoose = require('mongoose');

const { ClientWebsite, Client } = require('$models');
const { CustomError, errorsMessages } = require('../core/errors/index');

module.exports = async (req, res, next) => {
    try {

        const clientId = req.rigorous.user.id;

        if (!(clientId instanceof mongoose.mongo.ObjectID)) {
            throw new CustomError(errorsMessages.ClientIdNotExist);
        }

        const client = await Client
            .findOne({ _id: clientId.toString() })
            .select('_id')
            .exec();

        if (!client) {
            throw new CustomError(errorsMessages.ClientIdNotExist);
        }

        const result = await ClientWebsite.distinct('website_id', { client_id: client.id }).exec();
        
        req.rigorous.websitesIds = result;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
