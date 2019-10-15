
/**
 * Autoriser le require dynamique
 * Impact -> https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
 */
/* eslint global-require: 0 */ // --> OFF
/* eslint import/no-dynamic-require: 0 */ // --> OFF

import fs from 'fs';

const mongoose = require('mongoose');

function isModelDirectory(directory) {
    return (directory.indexOf('.') === -1 && directory.indexOf('__') === -1);
}

function isModelFile(file) {
    return (file === 'index.js');
}
function getModelFileName(file) {
    return file.substr(0, file.indexOf('.'));
}

/**
 * Connexion to mongodb via Mongoose Driver
 * 
	Note - Options possible: http://mongoosejs.com/docs/connections.html
	useMongoClient: true, // this param is no longer needed in 5.X
	autoIndex: false, // Don't build indexes
	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	reconnectInterval: 1000, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0
 */
module.exports = {

    get: () => mongoose,

    async connectMongoose(
        urlMongo,
        options = {

            /* autoIndex: true,
            autoCreate: true, */
            useCreateIndex: true,
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
            reconnectInterval: 1000,
            useNewUrlParser: true,
            autoIndex: true, // Pour cyp pour éviter cyclic dependency ?? impact -> https://stackoverflow.com/questions/14342708/mongoose-indexing-in-production-code
            useUnifiedTopology: true,
        },
    ) {

        const resConnection = await mongoose.connect(urlMongo, options);

        return resConnection;
    },

    loadModels(pathModel) {

        return new Promise((resolve, reject) => {
            
            fs.readdirSync(pathModel).forEach((directory) => {
    
                if (isModelDirectory(directory)) {
    
                    fs.readdirSync(`${pathModel}/${directory}`).forEach((file) => {
                        
                        if (isModelFile(file)) {
    
                            const name = getModelFileName(file);
    
                            try {
        
                                require(`${pathModel}/${directory}/${name}`);

                            } catch (err) {
        
                                console.log(`Model ${directory} failed to load: ${err.toString()}`);
                                return reject(err);
                            }
                        }
                       
                        return null;
                    });
                    
                }
    
                return null;
            });
                
            return resolve();
        });
    },
    
};
