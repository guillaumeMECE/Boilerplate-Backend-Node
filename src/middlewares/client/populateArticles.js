const { Article } = require('$models');

module.exports = async (req, res, next) => {
    try {
        if (req.rigorous === undefined) {
            throw new Error('You must call middleware createCustomer beforehand');
        }

        if (req.rigorous.websites === undefined) {
            throw new Error('You must call middleware populateWebsites beforehand');
        }

        const articles = await Article.distinct('_id')
            .where('website_id').in(req.rigorous.websites)
            .exec();

        if (articles.length) {
            req.rigorous.articles = articles;
            next();
        } else {
            throw new Error('You are not selling any articles');
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({ 'message': error.message });
    }
};
