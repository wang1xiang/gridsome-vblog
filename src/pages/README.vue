<template>
  <Layout>
    <div>
      <el-card
        shadow="never"
        style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px"
      >
        <div v-html="$page.allBlogContent.edges.node"></div>
      </el-card>
    </div>
  </Layout>
</template>

<page-query>

</page-query>

<script>
export default {
  name: 'Readme',
  metaInfo: {
    title: '关于',
  },
}
</script>
