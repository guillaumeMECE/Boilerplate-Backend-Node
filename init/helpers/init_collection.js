const initCollectionObjects = require('./init_collection_objects');

module.exports = {
    
    run: async (connect, collectionName, collectionObjects) => {

        return new Promise((resolve, reject) => {

            connect()
                .then(({ db, client }) => {

                    db.listCollections({ name: collectionName })
                        .next(async (err, collinfo) => {
                            if (!collinfo) {

                                await initCollectionObjects.run(connect, collectionName, collectionObjects);
                                console.log(`${collectionName} initialization`);
            
                            } else {

                                console.log(`${collectionName} already exist so nothing changed`);
                            }

                            client.close();
                            resolve();
                        });

                })
                .catch((err) => {
                    reject();
                });
        });

            
    },
};
