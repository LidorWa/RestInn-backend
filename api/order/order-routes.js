const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth-middleware')
const { log } = require('../../middlewares/logger-middleware')
const { getOrders, getOrderById, addOrder, updateOrder, removeOrder, addReview } = require('./order-controller.js')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

// router.get('/', log, getOrders)
// router.get('/:id', getOrderById)
// router.post('/', addOrder)
// router.put('/:id',  updateOrder)
// router.delete('/:id', removeOrder)



router.get('/', log, getOrders)
router.get('/:id', getOrderById)
router.post('/', requireAuth, requireHost, addOrder)
router.put('/:id', requireAuth, requireHost, updateOrder)
router.delete('/:id', requireAuth, requireHost, removeOrder)

module.exports = router