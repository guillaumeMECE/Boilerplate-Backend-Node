const { Website } = require('$models');

module.exports = async (req, res, next) => {
    try {
        if (req.rigorous === undefined) {
            throw new Error('You must call middleware createCustomer beforehand');
        }

        if (req.rigorous.websites === undefined) {
            throw new Error('You must call middleware populateWebsites beforehand');
        }

        const GAViews = await Website.distinct('ga_view_id')
            .where('_id').in(req.rigorous.websites)
            .exec();

        if (GAViews.length) {
            req.rigorous.GAViews = GAViews;
            next();
        } else {
            throw new Error('One of your website(s) is not linked to a Google Analytics view (Please contact an admin)');
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ 'message': error.message });
    }
};
