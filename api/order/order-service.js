const dbService = require('../../services/db-service')
const logger = require('../../services/logger-service')
const ObjectId = require('mongodb').ObjectId



async function query(filterBy) {
    try {
        const criteria = _buildCriteria(filterBy);
        const sort = _buildSort(filterBy)
        const collection = await dbService.getCollection('order')
        var orders = await collection.find(criteria).sort(sort).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        await collection.deleteOne({ '_id': ObjectId(orderId) })
        return orderId
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        order.createdAt = Date.now();
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        return addedOrder
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}
async function update(order) {
    try {
        var id = ObjectId(order._id)
        delete order._id
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ "_id": id }, { $set: { ...order } })
        return order
    } catch (err) {
        logger.error(`cannot update order ${orderId}`, err)
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