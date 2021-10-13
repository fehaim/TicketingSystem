const { MongoClient } = require('mongodb');

// Connection URL
const client = new MongoClient(config.mongo.url);
let usersCollection;
let rolesCollection;
let ticketsCollection;
let dbHandle;

async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    dbHandle = client.db(config.mongo.dbName);
    readinessEventEmitter.emit("mongoClient");
    console.log('Connected successfully to mongo server');
}

connectDB();



module.exports = {
    findItems: async (condition, collectionName, projection) => {
        return await dbHandle.collection(collectionName).find(condition).project(projection).toArray();
    },
    findItemById: async ( id , collectionName ) => {
        return await dbHandle.collection(collectionName).findOne({_id: id});
    },
    updateItem: async ( id, item, collectionName) => {
       item._id = id;
        await dbHandle.collection(collectionName).updateOne({_id: id}, {$set : item}, {upsert: true});
    },
    updateAll: async ( item, collectionName) => {
        await dbHandle.collection(collectionName).updateMany({}, {$set : item}, {upsert: true});
    },
    deleteAll: async ( item, collectionName) => {
        await dbHandle.collection(collectionName).updateMany({}, {$unset : item}, {multi: true});
    },
    deleteFields: async ( id, item, collectionName) => {
        await dbHandle.collection(collectionName).updateOne({_id: id}, {$unset : item}, {upsert: true});
    },
    createItemIfNotExists: async ( item, collectionName) => {
        await dbHandle.collection(collectionName).updateOne({_id: item._id }, {$setOnInsert : item}, {upsert: true});
    },
    insertItem: async (item, collectionName) => {
        return await dbHandle.collection(collectionName).insertOne(item);
    },
    getItems: async (collectionName) => {
        let result = await dbHandle.collection(collectionName).find({}).toArray();
        return result;
    }

};

