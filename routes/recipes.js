const router = require('express').Router()
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/recipes')
const { useRedis } = require('../middlewares/redis')

// READ
// /data/:id? <-- optional parameter
router.get('/:id?', useRedis, userController.getRecipes)

module.exports = router
