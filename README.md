##### 项目访问地址

http://106.75.190.29:8080/gridsome-blog/

##### 项目构建过程

- 首页静态内容相关

  - 将 Layotu.vue 内容复制到 Default.vue 中，通过 defaultStyle.js 设置默认展示样式
  - 创建 request.js，封装 axios 请求
  - 在 gridsome.server.js 中请求 github 用户信息，并通过集合 User 保存
  - 通过`<static-query>`获取 User 集合信息，加载到页面中
  - `appMain`组件通过 `<slot />`默认插槽替代

- news 页面

  - 获取用户 gists 信息，渲染到页面

  - 获取 github Your gists 数据

  - [发布测试 gists](https://gist.github.com/wang1xiang)，设置`create public gist`

    ![image-20210411170421374](C:\Users\xiang wang\AppData\Roaming\Typora\typora-user-images\image-20210411170421374.png)

  - 发布完成，通过`https://api.github.com/users/wang1xiang/gists`查询是否有内容

  - 通过`https://api.github.com/gists/09b4809690b8f8be13c188ea80cc48ef`查询对应 gist 具体详情

- 博客列表页面

  - 同 news 页面，将文章列表渲染到页面

  - 创建博客列表详情的模板页面，根据对应 id 创建模板内容

    ```js
    // gridsome.config.js
    templates: {
        Gist: [
          {
            path: '/gist/:id',
            component: './src/templates/Gist.vue',
          },
        ],
      },
    ```

* 开源项目页面

  - 在 gridsome.server.js 中新增对 repo 的请求，并添加到 Project 集合
  - 创建 projects.vue，将对应代码复制，通过 allProject 将数据渲染到页面
  - 创建 project/[name].vue 动态路由用于 projects 详情跳转，并在 created 中获取指定项目 README.md 渲染

* 社交圈页面

  同开源项目页面

* README.md 页面

##### 项目部署

- `yarn build`打包项目
- 通过远程工具将`dist`和`node_modules`目录推送到远程
- 使用 pm2 启动项目 `pm2 start -- npm run develop --name gridsome-blog`

##### 使用 GitHub Action 实现自动部署

自动部署出错，未查出问题，以后在研究

```bash
Error: Bad credentials
```
