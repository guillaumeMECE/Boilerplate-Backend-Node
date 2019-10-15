
const { Client } = require('$models');

module.exports = async function (req, res, next) {
    try {
        const client = await Client.findOne()
            .where('_id').equals(req.rigorous.user.id)
            .select('role')
            .exec();
        console.log('id in middleware', req.rigorous.user.id);
        console.log('role in middleware', client.role);

        if (client.role !== 'admin') {
            throw new Error('Not enough permissions');
        }

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });
    }
};
