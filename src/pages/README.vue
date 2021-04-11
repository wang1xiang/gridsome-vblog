<template>
  <Layout>
    <div>
      <el-card
        shadow="never"
        style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px"
      >
        <div v-html="$page.allAboutContent.edges[0].node.content"></div>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>
query {
  allAboutContent {
    edges {
      node {
        content
      }
    }
  }
}
</page-query>

<script>
export default {
  name: 'Readme',
  metaInfo: {
    title: '关于',
  },
}
</script>
