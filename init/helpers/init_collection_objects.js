const addObjectsInCollection = require('./add_objects_in_collection');

module.exports = {
    
    run: (connect, collectionName, collectionsObject) => {
    
        return new Promise((resolve, reject) => {

            connect().then(({ db, client }) => {
            
                // On supprime la collection
                db.collection(collectionName).drop((err, delOk) => {
                
                    client.close();

                    if (err) { console.log('err ', err); }

                    if (delOk) {
                        console.log(`Collection ${collectionName} deleted`); 
                    } else {
                        console.log(`Collection ${collectionName} not exists`); 
                    }
                    
                    return addObjectsInCollection.run(connect, collectionName, collectionsObject)
                        .then(() => {
                            
                            return resolve();
                        })
                        .catch((err2) => { return reject(err2); });

                });
                
            })
                .catch((err) => { console.log('err', err); return reject(); });
        });
    },

};
