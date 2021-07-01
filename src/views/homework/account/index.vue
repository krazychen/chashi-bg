<template>
  <app-main />
</template>

<script>
import AppMain from '@/components/AppMain'
export default {
  components: {
    AppMain
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-form {
    max-width: 560px;
  }
</style>
