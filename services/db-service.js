const MongoClient = require('mongodb').MongoClient;
const config = require('../config')
const logger = require('./logger-service')

const dbName = 'restinn'
var dbConn = null

module.exports = {
    getCollection,
    connect,
    dbConn
}

// Database Name


async function getCollection(collectionName) {
    try {
        const collection = await dbConn.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    const client = new MongoClient(config.dbURL);
    try {
        await client.connect();
        const db = client.db(dbName)
        dbConn = db
        return dbConn
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err;
    }
}
