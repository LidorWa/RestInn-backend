const express = require('express')
const { requireAuth, requireHost } = require('../../middlewares/requireAuth-middleware')
const { log } = require('../../middlewares/logger-middleware')
const { getStays, getStayById, addStay, updateStay, removeStay, addReview } = require('./stay-controller.js')
const router = express.Router()


// // // WITHOUT AUTHENTICATION // // //

router.get('/', log, getStays) 
router.get('/:id', getStayById) 
router.post('/', addStay) 
router.put('/:id',  updateStay) 
router.delete('/:id', removeStay) 



// router.get('/', log, getStays)
// router.get('/:id', getStayById)
// router.post('/', requireAuth, requireHost, addStay)       
// router.put('/:id', requireAuth, requireHost updateStay)
// router.delete('/:id', requireAuth, requireHost, removeStay)

module.exports = router