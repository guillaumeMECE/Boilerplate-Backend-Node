const { ClientWebsite } = require('$models');

module.exports = async (req, res, next) => {
    try {
        if (req.rigorous === undefined) {
            throw new Error('You must call middleware createCustomer beforehand');
        }

        const websites = await ClientWebsite.distinct('website_id')
            .where('client_id').equals(req.rigorous.user.id)
            .exec();

        if (websites.length) {
            req.rigorous.websites = websites;
            next();
        } else {
            throw new Error('You are not the admin of any website');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ 'message': error.message });
    }
};
