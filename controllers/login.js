require('dotenv').config()
const bcrypt = require('bcrypt')
const accouts = require('../models/accouts')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const checkEmail = await accouts.getUserByEmail({ email })

    // kalo check email isinya tidak ada
    if (checkEmail?.length === 0) {
      throw 'Email tidak terdaftar'
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      try {
        if (err) {
          throw { code: 500, message: 'ada kesalah pada server' }
        }

        const token = jwt.sign(
          {
            id: checkEmail[0]?.id,
            name: checkEmail[0]?.name,
            email: checkEmail[0]?.email,
            iat: new Date().getTime(),
          },
          process.env.JWT_KEY,
          { expiresIn: '1s' }
        )

        if (result) {
          res.status(200).json({
            status: true,
            message: 'login berhasil',
            data: {
              token,
            },
          })
        } else {
          throw { code: 400, message: 'login gagal password salah' }
        }
      } catch (error) {
        res.status(error?.code ?? 500).json({
          status: false,
          message: error?.message ?? error,
          data: [],
        })
      }
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    })
  }
}

module.exports = { login }
