const express = require('express')
const app = express() // inisialisasi
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')
const path = require('path')
const port = 8080
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const recipeRoutes = require('./routes/recipes')

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

// use middleware for grant access upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)

// grant access for public
app.use('/images', express.static(path.join(__dirname, 'public')))

// register users route
app.use('/users', userRoutes)

// register auth route
app.use('/auth', authRoutes)

// register auth route
app.use('/recipe', recipeRoutes)

// register auth route
app.get('/', (req, res) => {
  res.json({
    status: true,
    message: 'App running well',
  })
})

// aku menjalankan express pada port variable diatas
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
