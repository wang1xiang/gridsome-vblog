const axios = require('axios')

const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 60000,
})

module.exports = request
