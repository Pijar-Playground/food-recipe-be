const express = require('express')
const db = require('./db') // import dari file ./db.js
const app = express() // inisialisasi
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use cors
app.use(cors()) // cors for everyone

// whitelist ip cors
// const allowedOrigins = ['https://www.tokopedia.com', 'http://localhost:3000/']
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // (like mobile apps or curl requests)
//       if (!origin) return callback(null, true)
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           'The CORS policy for this site does not ' +
//           'allow access from the specified Origin.'
//         return callback(new Error(msg), false)
//       }
//       return callback(null, true)
//     },
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   })
// )

// READ
// /data/:id? <-- optional parameter
app.get('/users/:id?', async (req, res) => {
  try {
    const { id } = req.params // /data/:id
    const { page, limit, sort } = req.query // ?page=1&limit=5

    if (id) {
      const getSelectedUser = await db`SELECT * FROM account WHERE id = ${id}`

      res.status(200).json({
        status: true,
        message: 'data berhasil di ambil 2',
        data: getSelectedUser,
      })
    } else {
      // OFFSET & LIMIT
      let getAllUser

      if (limit && page) {
        getAllUser = await db`SELECT * FROM account ${
          sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
        } LIMIT ${limit} OFFSET ${limit * (page - 1)} `
      } else {
        getAllUser = await db`SELECT * FROM account ${
          sort ? db`ORDER BY id DESC` : db`ORDER BY id ASC`
        }`
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
})

app.get('/users-2/:id?', (req, res) => {
  const { id } = req.params

  if (id) {
    const getSelectedUser = db`SELECT * FROM account WHERE id = ${id}`

    getSelectedUser
      .then((result) => {
        res.status(200).json({
          status: true,
          message: 'data berhasil di ambil',
          data: result,
        })
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: 'data gagal di ambil',
          data: [],
        })
      })
  } else {
    const getAllUser = db`SELECT * FROM test`

    getAllUser
      .then((result) => {
        res.status(200).json({
          status: true,
          message: 'data berhasil di ambil',
          data: result,
        })
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          message: 'data gagal di ambil',
          data: [],
        })
      })
  }
})

// CREATE
app.post('/users/add', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body

    // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
    const addToDb = await db`
      INSERT INTO account (name, email, password, phone) 
      VALUES (${name}, ${email}, ${phone}, ${password})
    `

    res.json({
      status: true,
      message: 'berhasil di tambah',
      data: addToDb,
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
})

// UPDATE
// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
app.patch('/users/edit/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, password, photo } = req.body

    const getUser = await db`SELECT * FROM account WHERE id = ${id}`

    if (getUser) {
      // INSERT INTO account (id, name, email, password, phone, photo) VALUES ("bilkis")
      await db`
        UPDATE account SET
          "name" = ${name || getUser[0]?.name},
          "email" = ${email || getUser[0]?.email},
          "phone" = ${phone || getUser[0]?.phone},
          "password" = ${password || getUser[0]?.password},
          "photo" = ${photo || getUser[0]?.photo}
        WHERE "id" = ${id};
      `
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
})

//  DELETE
// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai
app.delete('/users/delete/:id', async (req, res) => {
  try {
    const { id } = req.params

    await db`DELETE FROM "public"."account" WHERE "id" = ${id}`

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
})

// aku menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
