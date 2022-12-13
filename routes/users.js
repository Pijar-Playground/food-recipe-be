const router = require('express').Router()
const { validateCreate } = require('../middlewares/validation')
const userController = require('../controllers/users')
const cloudinary = require('../cloudinary')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

// READ
// /data/:id? <-- optional parameter
router.get('/:id?', userController.getUsers)

// CREATE
router.post('/add', validateCreate, userController.postUsers)

// Upload
router.post('/upload', (req, res) => {
  let file = req.files.photo
  let fileName = `${uuidv4()}-${file.name}`
  let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`

  file.mv(uploadPath, async function (err) {
    cloudinary.v2.uploader.upload(
      uploadPath,
      { public_id: uuidv4() },
      function (error, result) {
        res.json(result)
      }
    )
  })
})

// UPDATE
// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
router.patch('/edit/:id', userController.editUsers)

//  DELETE
// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai
router.delete('/delete/:id', userController.deleteUsers)

module.exports = router
