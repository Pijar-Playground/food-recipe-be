const accouts = require('../models/accouts')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const getUsers = async (req, res) => {
  try {
    const { id } = req.params // /data/:id
    const { page, limit, sort } = req.query // ?page=1&limit=5

    if (id) {
      const getSelectedUser = await accouts.getUserById({ id })

      res.status(200).json({
        status: true,
        message: 'data berhasil di ambil',
        data: getSelectedUser,
      })
    } else {
      // OFFSET & LIMIT
      let getAllUser

      if (limit && page) {
        getAllUser = await accouts.getAllUsersPagination({ limit, page })
      } else {
        getAllUser = await accouts.getAllUsers({ sort })
      }

      if (getAllUser.length > 0) {
        res.status(200).json({
          status: true,
          message: 'data berhasil di ambil',
          total: getAllUser?.length,
          page: page,
          limit: limit,
          data: getAllUser,
        })
      } else {
        throw 'Data kosong silahkan coba lagi'
      }
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const postUsers = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    const checkDuplicateEmail = await accouts.getUserByEmail({ email })

    if (checkDuplicateEmail.length >= 1) {
      throw { code: 401, message: 'Email sudah terdaftar' }
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.photo
    let fileName = `${uuidv4()}-${file.name}`
    let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
    let mimeType = file.mimetype.split('/')[1]
    let allowFile = ['jpeg', 'jpg', 'png', 'webp']

    // validate size image
    if (file.size > 1048576) {
      throw 'File terlalu besar, max 1mb'
    }

    if (allowFile.find((item) => item === mimeType)) {
      // Use the mv() method to place the file somewhere on your server
      file.mv(uploadPath, async function (err) {
        // await sharp(file).jpeg({ quality: 20 }).toFile(uploadPath)

        if (err) {
          throw 'Upload foto gagal'
        }

        const addToDb = await accouts.addNewUsers({
          name,
          email,
          phone,
          password,
          photo: `/images/${fileName}`,
        })

        res.json({
          status: true,
          message: 'berhasil di tambah',
          data: addToDb,
          // path: uploadPath,
        })
      })
    } else {
      throw 'Upload foto gagal, hanya menerima format photo'
    }

    // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const editUsers = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password, photo } = req.body

    const getUser = await accouts.getUserById({ id })

    if (getUser) {
      // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
      await accouts.updateUser({
        name,
        email,
        phone,
        password,
        photo,
        id,
        defaultValue: getUser[0], // default value if input not add in postman
      })
    } else {
      throw 'ID Tidak terdaftar'
    }

    res.json({
      status: true,
      message: 'berhasil di ubah',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params

    await accouts.deleteUserById({ id })

    res.json({
      status: true,
      message: 'berhasil di hapus',
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { getUsers, postUsers, editUsers, deleteUsers }
