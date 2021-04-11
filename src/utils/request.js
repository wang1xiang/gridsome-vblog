const axios = require('axios')

const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 60000,
  headers: {
    Authorization: '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',
  },
})

module.exports = request
