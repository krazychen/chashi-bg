<template>
  <div>
    <el-form ref="form" :model="form" style="display: flex;">
      <el-input v-model="form.query" placeholder="请输入内容" style="width: 320px;" size="small" />
      <el-button icon="el-icon-search" size="small">
        Search
      </el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      form: {
        query: null
      }
    }
  }
}
</script>
