const cloudinary = require('cloudinary')

function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

cloudinary.config({
  cloud_name: 'dunn0czwh',
  api_key: '887785185143842',
  api_secret: 'Dq229-FaBdkWEgYuOHCA9PtmZgg',
})

module.exports = { formatBytes, cloudinary }
