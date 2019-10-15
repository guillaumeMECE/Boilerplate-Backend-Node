const { Website, Article, Client, ClientWebsite, Auth, Swit, Brand, Blacklistruleuser } = require('$models');
const { generateAccount,
    generateAuth,
    generateWebsite,
    generateSwit,
    generateArticle,
    generateClientWebsite,
    generatePassword
} = require('./generateSeed');

export const createSwit = async (payload) => {
    return new Swit(generateSwit(payload)).save();
};

export const createArticle = async (payload) => {
    return new Article(generateArticle(payload)).save();
};

export const createWebsite = async (payload = 'websiteForUnitTest') => {
    const testWebsite = generateWebsite(payload);
    const article = await createArticle(testWebsite._id);
    await createSwit(article._id);
    return new Website(testWebsite).save();
};

export const createWebsiteWithoutArticle = async (payload = 'websiteForUnitTestWithoutArticle') => {
    return new Website(generateWebsite(payload)).save();
};

export const createAuth = async (payload = {}) => {
    const newAuth = generateAuth(payload);
    const auth = await Auth.create(newAuth);
    auth.token = await Auth.generateTokenAuth(auth);
    return auth;
};

export const createClient = async (payload = 'testaccount', _role = 'client') => {
    const client = await new Client(generateAccount(payload, _role)).save();
    const auth = await createAuth(client);
    client.auth_id = auth.id;
    client.token = auth.token;
    client.password = generatePassword(payload);
    return client;
};

export const createClientWebsite = async (clientID, websiteID) => {
    return new ClientWebsite(generateClientWebsite(clientID, websiteID)).save();
};

export const createClientWebsiteLink = async (payload = 'guillaumemaurin') => {
    const client = await createClient(payload, 'admin');
    const website = await createWebsite();
    await createClientWebsite(client._id, website._id);
    return {
        client,
        website
    };
};

export const createBrand = async (name = 'guibrandfortst') => {
    return new Brand({ name }).save();
};

export const createBlacklistruleuser = async (payload = 'blackgui') => {
    const blackListRule = {
        name: payload,
        field: payload,
        regex: payload
    };
    return Blacklistruleuser.create(blackListRule);
};
