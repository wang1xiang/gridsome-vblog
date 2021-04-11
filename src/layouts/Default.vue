<template>
  <div>
    <section
      class="page-header"
      :style="{
        backgroundImage: `linear-gradient(120deg, ${defaultStyle.backgroundColorLeft}, ${defaultStyle.backgroundColorRight})`,
        color: defaultStyle.fontColor,
      }"
    >
      <div style="position:absolute; top:20px; right:20px; z-index:2;">
        <el-tooltip
          effect="dark"
          :content="fullButton.full ? '退出' : '全屏'"
          placement="bottom-end"
        >
          <el-button
            @click="full"
            :icon="fullButton.full ? 'el-icon-close' : 'el-icon-rank'"
            circle
          ></el-button>
        </el-tooltip>
      </div>
      <div
        v-for="(item, index) in randomIcon"
        :key="'ri' + index"
        :style="
          'position:absolute; top:' +
            item.top +
            'px; left:' +
            item.left +
            'px; z-index:1;'
        "
      >
        <font :style="'font-size: ' + item.size + 'px;color:#fff;'">
          <b>♪</b>
        </font>
      </div>
      <h1 class="project-name">{{ defaultStyle.blogTitle }}</h1>
      <h2 class="project-tagline">{{ defaultStyle.blogDescribe }}</h2>
      <a
        :href="'https://github.com/' + defaultStyle.githubUsername"
        class="btn"
        target="_blank"
        >GitHub主页</a
      >
      <a
        href="https://github.com/wang1xiang/gridsome-vblog"
        class="btn"
        target="_blank"
        v-if="!defaultStyle.mini"
        >博客源码</a
      >
    </section>
    <div
      style="position:relative;  z-index:2;margin: auto;margin-top:-30px;width:64rem;"
    >
      <el-card shadow="never" :body-style="{ padding: '0px' }">
        <el-row>
          <el-col :span="10">
            <el-menu
              @select="selectTopbar"
              :default-active="topbar.active"
              mode="horizontal"
              menu-trigger="click"
            >
              <el-submenu index="#more">
                <template slot="title">了解博主</template>
                <el-menu-item index="#githubHome">github主页</el-menu-item>
                <el-menu-item index="#blog">其他博客</el-menu-item>
              </el-submenu>
              <el-submenu
                index="#webSites"
                v-if="defaultStyle.webSites.length > 0"
              >
                <template slot="title">其他网站</template>
                <el-menu-item
                  :index="'#webSites-' + index"
                  v-for="(item, index) in defaultStyle.webSites"
                  :key="'#webSites' + index"
                  >{{ item.name }}</el-menu-item
                >
              </el-submenu>
            </el-menu>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <div style="font-size: 20px;color:#606266;margin-top: 5px">
              <b>{{ defaultStyle.githubUsername }}</b>
            </div>
            <div style="color:#606266;">
              <i class="el-icon-location"></i>&nbsp;{{
                users.location ? users.location : '未填写地址'
              }}
              <br />
            </div>
          </el-col>
          <el-col :span="2" style="text-align: center;">
            <img
              v-popover:bigAvatar
              :src="users.avatar_url"
              style="margin-top: 4px;margin-right: 10px;width:52px; height:52px; border-radius:5px; border: 1px solid #EBEEF5"
            />
            <el-popover
              ref="bigAvatar"
              placement="top-start"
              :title="defaultStyle.githubUsername"
              width="200"
              trigger="hover"
            >
              <i class="el-icon-star-on"></i>&emsp;{{ users.name }}
              <br />
              <i class="el-icon-location"></i>&emsp;{{ users.location }}
              <br />
              <img
                :src="users.avatar_url"
                style="width: 200px;height: 200px;"
              />
            </el-popover>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <section class="main-content">
      <el-row>
        <el-col :span="6" style="padding-right:10px">
          <sidebar></sidebar>
        </el-col>
        <el-col :span="18" style="padding-left:10px">
          <transition name="fade" appear>
            <slot />
          </transition>
        </el-col>
      </el-row>
    </section>
    <section class="foot">
      <foot></foot>
    </section>
  </div>
</template>

<static-query>
query {
  allUser {
    edges {
      node {
        id
        name
        avatar_url
        location
        blog
        followers
        following
      }
    }
  }
}

</static-query>

<script>
import Sidebar from './components/Sidebar'
import Foot from './components/Foot'
import { randomInt, fullScreen, fullExit } from '@/utils/util'
import defaultStyle from '../assets/defaultStyle'

export default {
  name: 'Layout',
  components: { Sidebar, Foot },
  data() {
    return {
      defaultStyle,
      fullButton: {
        full: false,
      },
      randomIcon: [],
      topbar: {
        active: '',
      },
    }
  },
  computed: {
    users() {
      const all = this.$static.allUser
      return (all.edges && all.edges[0].node) || {}
    },
  },
  mounted() {
    let width = window.innerWidth
    for (let i = 0; i < 12; i++) {
      let temp = {}
      let left = randomInt(10, width - 310)
      if (left > width / 2 - 150) {
        left += 300
      }
      temp.left = left
      temp.top = randomInt(20, 300)
      temp.size = randomInt(20, 40)
      this.randomIcon.push(temp)
    }
  },
  methods: {
    selectTopbar(index) {
      //取消菜单选中状态
      this.topbar.active = this.topbar.active == '' ? ' ' : ''
      switch (index) {
        case '#githubHome':
          window.open(`https://github.com/${this.username}`)
          break
        default:
          if (/#webSites-\d+/.test(index)) {
            let i = parseInt(index.split('-')[1])
            let url = this.defaultStyle.webSites[i].url
            window.open((url.match(/https?:\/\//i) ? '' : 'https://') + url)
          }
          break
      }
    },
    full() {
      if (!this.fullButton.full) {
        fullScreen()
        this.fullButton.full = true
      } else {
        fullExit()
        this.fullButton.full = false
      }
    },
  },
}
</script>

<style>
body {
  margin: 0;
}
.page-header {
  padding: 5rem 6rem;
  color: #fff;
  text-align: center;
  background-color: #159957;
  background-image: linear-gradient(120deg, #155799, #159957);
}

.project-name {
  font-size: 3.25rem;
  margin-top: 0;
  margin-bottom: 0.1rem;
}

.project-tagline {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  font-weight: normal;
  opacity: 0.7;
}

.btn:hover {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

a:hover {
  text-decoration: underline;
}

a:active,
a:hover {
  outline: 0;
}

.btn {
  padding: 0.75rem 1rem;
  display: inline-block;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  border-style: solid;
  border-width: 1px;
  border-radius: 0.3rem;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

a {
  color: #1e6bb8;
  text-decoration: none;
}

.btn + .btn {
  margin-left: 1rem;
}

.main-content {
  max-width: 64rem;
  padding: 30px 0px 30px 0px;
  margin: 0 auto;
  font-size: 1.1rem;
  word-wrap: break-word;
  min-height: 800px;
}

.foot {
  max-width: 67rem;
  margin: 0 auto;
  font-size: 12px !important;
  color: #586069 !important;
  word-wrap: break-word;
}
</style>
