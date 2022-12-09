const express = require('express')
const app = express() // inisialisasi
const port = 3000

const database = [6, 2, 4] // ini adalah nilai awal

// READ
// /data/:index? <-- optional parameter
app.get('/data/:index?', (req, res) => {
  const { index } = req.params

  res.json({
    status: true,
    messages: 'data berhasil di akses',
    data: index ? database[index] : database
  })
})

// CREATE
app.post('/data/add', (req, res) => {
  database.push(Math.random())
  res.json({
    status: true,
    message: 'berhasil di tambah'
  })
})

// UPDATE

// "/data/update/:indexs" <--- paramter data
// /data/update/2/4 <-- cara pakai
app.patch('/data/update/:index/:value', (req, res) => {
  const { index, value } = req.params

  database[index] = parseInt(value, 10)

  res.json({
    status: true,
    message: 'berhasil di ubah'
  })
})

//  DELETE

// "/data/delete/:indexs" <--- paramter data
// /data/delete/2 <-- cara pakai

app.delete('/data/delete/:index', (req, res) => {
  const { index } = req.params

  delete database[index]

  res.json({
    status: true,
    message: 'berhasil di hapus'
  })
})

// aku menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
