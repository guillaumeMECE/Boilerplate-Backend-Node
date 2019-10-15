const CustomError = require('../core/errors/CustomError');
const errorsMessages = require('../core/errors/errorsMessages');

const { ClientWebsite } = require('$models');

module.exports = async (req, res, next) => {
    try {
        const clientWebsite = await ClientWebsite.findOne()
            .where('client_id').equals(req.rigorous.user.id)
            .where('website_id').equals(req.params.websiteId)
            .exec();
        if (clientWebsite) {
            next();
        } else {
            res.status(500).json({ error: new CustomError(errorsMessages.AccessDeclinedError) });
        }
    } catch (error) {
        res.status(500).json({ error: new CustomError(errorsMessages.MongoDBError, error) });
    }
};
