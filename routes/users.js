const router = require('express').Router()
const { validateCreate } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users')
// READ
// /data/:id? <-- optional parameter
router.get('/:id?', validateToken, userController.getUsers)

// CREATE
router.post('/add', validateCreate, userController.postUsers)

// UPDATE
// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
router.patch('/edit/:id', validateToken, userController.editUsers)

//  DELETE
// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai
router.delete('/delete/:id', validateToken, userController.deleteUsers)

module.exports = router

// 1. password
// apakah password di database === password yang di kirim di client
