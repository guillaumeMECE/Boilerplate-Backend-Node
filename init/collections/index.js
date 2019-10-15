const connect = require('../connect');
const initCollection = require('../helpers/init_collection');

const ARTICLE_CATEGORYS = require('./storage/articlecategorys');
const ARTICLE_THEMES = require('./storage/articlethemes');
const SWITLIST_CATEGORYS = require('./storage/switlistcategorys');

async function start() {

    try {

        await initCollection.run(connect.run, 'articlecategorys', ARTICLE_CATEGORYS);
        await initCollection.run(connect.run, 'articlethemes', ARTICLE_THEMES);
        await initCollection.run(connect.run, 'switlistcategorys', SWITLIST_CATEGORYS);

    } catch (err) {

        console.log(err);
    }
}

start();

console.log('Init DB done');
