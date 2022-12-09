const router = require('express').Router()
const { validateCreate } = require('../middlewares/validation')
const userController = require('../controllers/users')
// READ
// /data/:id? <-- optional parameter
router.get('/:id?', userController.getUsers)

// CREATE
router.post('/add', validateCreate, userController.postUsers)

// UPDATE
// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
router.patch('/edit/:id', userController.editUsers)

//  DELETE
// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai
router.delete('/delete/:id', userController.deleteUsers)

module.exports = router
