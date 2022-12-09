const { Validator, addCustomMessages, extend } = require('node-input-validator')

const validateCreate = (req, res, next) => {
  extend('nameNotContainPassword', ({ value }) => {
    if (req.body.name !== req.body.password) {
      return true
    }
    return false
  })

  addCustomMessages({
    'name.required': 'Prriitt wajib ada',
    'name.minLength': 'Priittt kependekan',
    'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  })

  const rules = new Validator(req.body, {
    name: 'required|minLength:5|maxLength:50|nameNotContainPassword',
    email: 'required|minLength:3|maxLength:70|email',
    phone: 'required|minLength:6|maxLength:14|phoneNumber',
    password: 'required|minLength:8|alphaNumeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: [],
      })
    }
  })
}

const validateUpdate = (req, res, next) => {
  extend('nameNotContainPassword', ({ value }) => {
    if (req.body.name !== req.body.password) {
      return true
    }
    return false
  })

  addCustomMessages({
    'name.required': 'Prriitt wajib ada',
    'name.minLength': 'Priittt kependekan',
    'name.nameNotContainPassword': 'Nama tidak boleh mengandung password',
  })

  const rules = new Validator(req.body, {
    name: 'required|minLength:5|maxLength:50|nameNotContainPassword',
    email: 'required|minLength:3|maxLength:70|email',
    phone: 'required|minLength:6|maxLength:14|phoneNumber',
    password: 'required|minLength:8|alphaNumeric',
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: [],
      })
    }
  })
}

module.exports = { validateCreate, validateUpdate }
