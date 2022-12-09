const express = require('express')
const app = express() // inisialisasi
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const port = 3000

const userRoutes = require('./routes/users')

// 1. MMVC = MIDDLEWARE MODEL VIEW CONTROLLER
// 2. Security = Sanitasi / validation, basic security

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// use helmet
app.use(helmet())

// user xss clean
app.use(xss())

// use cors
app.use(cors()) // cors for everyone

// register users route
app.use('/users', userRoutes)

// aku menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
