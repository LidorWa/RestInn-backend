const express = require('express')
const { requireAuth, requireHost } = require('../../middlewares/requireAuth-middleware')
const { getUser, getUsers, deleteUser, addUser, updateUser } = require('./user-controller')
const router = express.Router()


router.get('/', getUsers)  
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.post('/', addUser) 
router.delete('/:id', deleteUser)


// router.get('/', getUsers)  
// router.get('/:id', getUser)
// router.put('/:id',  requireAuth, updateUser)
// router.post('/',  requireAuth, updateUser) 
// router.delete('/:id',  requireAuth, requireHost, deleteUser)

module.exports = router
