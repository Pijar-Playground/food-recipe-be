const accouts = require('../models/accouts')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const saltRounds = 10
const { connect } = require('../middlewares/redis')
const { cloudinary } = require('../helper')

const getUsers = async (req, res) => {
  try {
    const { id } = req.params // /data/:id
    const { page, limit, sort } = req.query // ?page=1&limit=5

    if (id) {
      const getSelectedUser = await accouts.getUserById({ id })

      // store data to redis for 10 seconds
      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getSelectedUser), 'ex', 10) // string only
      connect.set('is_paginate', null, 'ex', 10) // string only

      res.status(200).json({
        status: true,
        message: 'data berhasil di ambil',
        data: getSelectedUser,
      })
    } else {
      // OFFSET & LIMIT
      let getAllUser

      if (limit && page) {
        getAllUser = await accouts.getAllUsersPagination({ limit, page, sort })
      } else {
        getAllUser = await accouts.getAllUsers({ sort })
      }

      // store data to redis for 10 seconds
      connect.set('url', req.originalUrl, 'ex', 10) // string only
      connect.set('data', JSON.stringify(getAllUser), 'ex', 10) // string only
      connect.set('total', getAllUser?.length, 'ex', 10) // string only
      connect.set('limit', limit, 'ex', 10) // string only
      connect.set('page', page, 'ex', 10) // string only
      connect.set('is_paginate', 'true', 'ex', 10) // string only

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
    // let fileName = `${uuidv4()}-${file.name}`
    // let uploadPath = `${path.dirname(require.main.filename)}/public/${fileName}`
    let mimeType = file.mimetype.split('/')[1]
    let allowFile = ['jpeg', 'jpg', 'png', 'webp']

    // validate size image
    if (file.size > 1048576) {
      throw 'File terlalu besar, max 1mb'
    }

    if (allowFile.find((item) => item === mimeType)) {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4() },
        function (error, result) {
          if (error) {
            throw 'Upload foto gagal'
          }

          bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              throw 'Proses authentikasi gagal, silahkan coba lagi'
            }

            // Store hash in your password DB.
            const addToDb = await accouts.addNewUsers({
              name,
              email,
              phone,
              password: hash,
              photo: result.url,
            })

            res.json({
              status: true,
              message: 'berhasil di tambah',
              data: addToDb,
              // path: uploadPath,
            })
          })
        }
      )
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
