module.exports = {
    
    run: async (connect, collectionName, collectionObjects) => {
    
        /**
         * Themes Cleaning
         */

        return new Promise((resolve, reject) => {
        
            connect().then(async ({ db, client }) => {
                        
                try {
        
                    for await (const obj of collectionObjects) {

                        await new Promise((resolve, reject) => {
                            db.collection(collectionName).insertOne(obj, (error, response) => {
                                if (error) {
                                    console.log('Error occurred while inserting');
                                    // return 
                                } else {
                                    return resolve();
                                    // return 
                                }
                            });
                        });
                    }
        
                    console.log(`${collectionName} Import done`);
        
                    client.close();
        
                    resolve();
                } catch (err) {
        
                    client.close();
        
                    console.log(err);
                    reject(err);
                }
            })
                .catch((err) => { console.log('err', err); return reject(); });
        });
    },

};
