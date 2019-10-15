

module.exports = {
    
    run: function (connect, collectionName, query = {}) {
    
        return new Promise((resolve, reject) => {
    
            connect().then(({ db, client }) => {
             
                db.collection(collectionName).find(query).toArray((err, objects) => {

                    client.close();

                    if (err) { console.log('err ', err); return reject(err); } 
        
                    return resolve(objects);  
                });
                
            })
                .catch((err) => { console.log('err', err); return reject(); });
        });
    
    },

};
