// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const config = require('./src/config')
const request = require('./src/utils/request')
const moment = require('moment')
const { Base64 } = require('js-base64')
const MarkdownIt = require('markdown-it')

module.exports = function(api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const collection = addCollection('User')

    const {
      data: {
        avatar_url,
        name,
        location = '',
        blog = '',
        followers,
        following,
      },
    } = await request(`/users/${config.USERNAME}`)
    collection.addNode({
      avatar_url,
      name,
      location,
      blog,
      followers,
      following,
    })
  })

  // 加载 gist
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('Gist')
    const md = new MarkdownIt()

    const { data } = await request(`/users/${config.USERNAME}/gists`)
    if (data && data.length > 0) {
      const { data: gistDetails } = await request(`/gists/${data[0].id}`)

      for (let key in gistDetails.files) {
        collection.addNode({
          title: key,
          url: gistDetails.files[key],
          content: md.render(gistDetails.files[key].content),
          description: gistDetails.description,
          createTime: moment(gistDetails.created_at).format(
            'YYYY-MM-DD HH:mm:SS'
          ),
          updateTime: moment(gistDetails.updated_at).format(
            'YYYY-MM-DD HH:mm:SS'
          ),
        })
      }
    }
  })
  // 加载 repo
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('Project')
    const { data } = await request(`users/${config.USERNAME}/repos`)

    for (let i = 0; i < data.length; i++) {
      let item = data[i]

      const {
        id,
        name,
        html_url: url,
        description,
        stargazers_count: stargazersCount,
        watchers_count: watchersCount,
        language,
        forks_count: forksCount,
        created_at,
        updated_at,
      } = item
      collection.addNode({
        id,
        name,
        url,
        description,
        stargazersCount,
        watchersCount,
        forksCount,
        language,
        license: item['license'] ? item['license']['spdx_id'] : '',
        createTime: moment(created_at).format('YYYY-MM-DD HH:mm:SS'),
        updateTime: moment(updated_at).format('YYYY-MM-DD HH:mm:SS'),
      })
    }
  })
  // 加载 followers
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('Followers')
    const { data } = await request(`/users/${config.USERNAME}/followers`)

    data.forEach((item) => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })

  // 加载 following
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('Following')
    const { data } = await request(`/users/${config.USERNAME}/following`)

    data.forEach((item) => {
      collection.addNode({
        name: item.login,
        avatarUrl: item.avatar_url,
        htmlUrl: item.html_url,
      })
    })
  })
  // 加载 readme
  api.loadSource(async ({ addCollection }) => {
    const collection = addCollection('AboutContent')

    let content = ''
    try {
      const { data } = await request(
        `/repos/${config.USERNAME}/gridsome-vblog/contents/README.md`
      )
      const md = new MarkdownIt()
      content = md.render(Base64.decode(data.content))
      collection.addNode({
        content,
      })
    } catch (e) {
      content = ''
    }
  })
  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
