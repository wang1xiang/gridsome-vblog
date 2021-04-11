const axios = require('axios')

const request = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 60000,
  headers: {
    Authorization: 'ghp_pnL38cBZqEINelghuCgJWoPQskXVSo4FUX6i',
  },
})

module.exports = request
