const _ = require('lodash');

const { Blacklistruleuser, User } = require('$models');

module.exports = async (req, res, next) => {
    const rules = await Blacklistruleuser.find().exec();

    const promises = [];

    rules.forEach((rule) => {
        promises.push(User.distinct('_id')
            .where(rule.field, new RegExp(rule.regex))
            // .find({ [rule.field]: { $regex: new RegExp(rule.regex), $options: 'i' } })
            .exec());
    });

    let blacklistedUsers = await Promise.all(promises);

    blacklistedUsers = _.flatten(blacklistedUsers);
    blacklistedUsers = _.uniq(blacklistedUsers);

    req.blacklistedUsersIds = blacklistedUsers;

    next();
};
