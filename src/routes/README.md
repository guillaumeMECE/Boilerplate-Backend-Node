/*
 * CHART CODE FOR ROUTE:
 * 
 * 1/4 SECURE INPUT (avoid script injection)
 * 2/4 CHECK CONFORMITY INPUT (to avoid integrity issues when editing multiple collections, if one fail because of validity)
 * 3/4 CHECK AUTHORIZATION (is the user legitim ?)
 * 4/4 PROCESS (handle not found case)
 */
 
Make sure every routes outputs FILTER_PUBLIC.
The only security is to check filter applied on each object in the Route.
Data should be AT MOST the CollectionX.getFilterPublic()
So be carefull when you apply personalized filter

#TODO Test should check API output if it is contained in CollectionX.getFilterPublic()

* HOW TO USE UPDATE ?
update.js       is to update data that require generic authorization check
update_xxx.js   is to update data that needs some custom authorizaton check

DO NOT GENERALIZE CREATE, UPDATE, DELETE
BECAUSE BEHAVIOUR CAN CHANGE WHEN DATA IS MODIFIED


* virtualReturnedFields condition ?
the select: in virtualReturnedFields needs to contain the local and foreign key

* How to create a field undefined or unique ?
    schema: {
        type: String,
        unique: true,
        sparse: true,
        index: true,
    },
    on: {
        create: {
            value: undefined, // to make sparse works 'My mistake was setting the default value to null. In some sense, Mongoose counts an explicit null as a value that must be unique. If the field is never defined (or undefined) then it is not enforced to be unique' - source: https://stackoverflow.com/questions/17125089/mongodb-unique-sparse-index
            transform: null,
        },

* Changing the Schema any impact ?
If you modify the index, you need to delete the index and recreate It in mongodb console for example
go to your mongodb console: 
db.auths.getIndexes()
db.auths.dropIndexes(* nameOfTheIndex *)
restart your server