const express = require('express')
const { requireAuth, requireHost } = require('../../middlewares/requireAuth-middleware')
const { log } = require('../../middlewares/logger-middleware')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder, addReview } = require('./order-controller.js')
const router = express.Router()


// router.get('/',  log, getOrders)
// router.get('/:id',log, requireAuth, requireHost, getOrderById)
// router.post('/',log, requireAuth, requireHost, addOrder)
// router.put('/:id',log, requireAuth, requireHost, updateOrder)
// router.delete('/:id',log, requireAuth, requireHost, removeOrder)

router.get('/',  log, getOrders)
router.get('/:id',log, getOrderById)
router.post('/',log, addOrder)
router.put('/:id',log, updateOrder)
router.delete('/:id',log, removeOrder)


module.exports = router