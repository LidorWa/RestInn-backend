const dbService = require('../../services/db-service')
const logger = require('../../services/logger-service')
const ObjectId = require('mongodb').ObjectId



async function query(filterBy) {
    try {
        // const criteria = _buildCriteria(filterBy);
        // const sort = _buildSort(filterBy)
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find().toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.deleteOne({ '_id': ObjectId(stayId) })
        return stayId
    } catch (err) {
        logger.error(`cannot remove stay ${stayId}`, err)
        throw err
    }
}

async function add(stay) {
    try {
        stay.createdAt = Date.now();
        const collection = await dbService.getCollection('stay')
        const addedStay = await collection.insertOne(stay)
        return addedStay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}
async function update(stay) {
    try {
        var id = ObjectId(stay._id)
        delete stay._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ "_id": id }, { $set: { ...stay } })
        stay._id = id;
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${id}`, err)
        throw err
    }
}


// function _buildCriteria(filterBy) {
//     const criteria = {};
//     if (filterBy.name) {
//         const nameCriteria = { $regex: filterBy.name, $options: 'i' }
//         criteria.name = nameCriteria
//     }
    
//     if (filterBy.inStock === 'true' || filterBy.inStock === 'false') {
//         criteria.inStock = (filterBy.inStock === "true")? true: false

//     }

//     if (filterBy.labels) {
//         criteria.labels = { $in: filterBy.labels }
//     }

//     return criteria;
// }

// function _buildSort({ sortBy }) {
//     if(!sortBy) return {}

//     return {[sortBy] :1}
// }



module.exports = {
    remove,
    query,
    getById,
    add,
    update,
}