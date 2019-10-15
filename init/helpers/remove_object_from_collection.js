module.exports = {
    
    run: (connect, collectionName, filter) => {
    
        /**
         * Themes Cleaning
         */

        return new Promise((resolve, reject) => {
        
            connect().then(({ db, client }) => {
                        
                try {
        
                    db.collection(collectionName).deleteOne(filter);
        
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
