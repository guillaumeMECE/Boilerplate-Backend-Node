require('dotenv/config');

const { MongoClient } = require('mongodb');

module.exports = {

    run: () => {

        return new Promise((resolve, reject) => {

            let host;
            const port = process.env.APPNAME_DB.indexOf('+srv') > -1 ? '' : `:${process.env.APPNAME_DB_PORT}`;
        
            if (process.env.APPNAME_DB_HOST === 'localhost' || process.env.APPNAME_DB_HOST === '127.0.0.1') {

                host = `${process.env.APPNAME_DB_HOST}${port}`;
            } else {

                host = `${process.env.APPNAME_DB_USER}:${process.env.APPNAME_DB_PASSWORD}@${process.env.APPNAME_DB_HOST}${port}`;
            }

            MongoClient.connect(`${process.env.APPNAME_DB}://${host}/${process.env.APPNAME_DB_DATABASE}`, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
                
                return err ? reject(err) : resolve({ db: client.db(process.env.APPNAME_DB_DATABASE), client });

            });
        });
    },
};
