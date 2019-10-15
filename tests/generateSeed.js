const mongoose = require('mongoose');

export const split = (param) => {
    const _s1 = (param.slice(0, Math.round(param.length / 2))).toLowerCase();
    const _s2 = (param.slice(Math.round(param.length / 2))).toLowerCase();
    return { s1: _s1, s2: _s2 };
};

export const generateEmail = (param) => {
    const splitString = split(param);
    return splitString.s1.concat('@', splitString.s2, '.fr');
};

export const generateName = (param) => {
    return param.slice(0, 1)
        .toUpperCase()
        .concat(
            param.slice(1).toLowerCase()
        );
};

export const generateUsername = (param) => {
    const nameString = generateName(param);
    return nameString.concat('-', nameString, '-123123');
};

export const generatePassword = (param) => {
    const passwordString = param.toLowerCase();
    return passwordString.concat('123123');
};

export const generateUrl = (param) => {
    return param.concat('.fr');
};

export const generateClientWebsite = (clientID, websiteID) => {
    return {
        client_id: clientID,
        website_id: websiteID
    };
};

export const generateSwit = (param) => {
    return {
        article_id: param,
        owner_id: new mongoose.mongo.ObjectID(),
        switlist_id: new mongoose.mongo.ObjectID(),
        permission_user_ids: new mongoose.mongo.ObjectID(),
        permission: true,
    };
};

export const generateArticle = (param) => {
    return {
        _id: new mongoose.mongo.ObjectID(),
        title: 'articleForUnitTest',
        description: ' test Article ',
        price: 999,
        currency: 'EUR',
        reference: ' ',
        image: ' ',
        link: param,
        scrapped_at: new Date(),
        scrapper_version: 0.1,
        articlecategory_id: new mongoose.mongo.ObjectID(),
        articlebrand_id: new mongoose.mongo.ObjectID(),
        website_id: param
    };
};

export const generateWebsite = (param) => {
    let ga;
    if (param === 'websiteForUnitTest') {
        ga = '186894103';
    } else {
        ga = 'NA';
    }
    return {
        _id: new mongoose.mongo.ObjectID(),
        name: param,
        url: generateUrl(param),
        ga_view_id: ga
    };
};

export const generateAccount = (param, _role) => {
    return {
        email: generateEmail(param),
        password: generatePassword(param),
        firstname: generateName(param),
        lastname: generateName(param),
        username: generateUsername(param),
        role: _role
    };
};

export const generateAuth = (param) => {
    return {
        email: param.email,
        password: generatePassword(param.firstname),
        type: 'Client',
        user_id: param._id,
    };
};
