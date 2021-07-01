<template>
  <div class="item-wrapper">
    <i v-if="item.meta && item.meta.faicon" :class="'fa fa-' + item.meta.faicon" :style="'background: ' + item.meta.bgcolor" />
    <el-badge v-if="badge > 0" :value="badge">
      {{ item.meta.title }}
    </el-badge>
    <span v-else>{{ item.meta.title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    badge: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-wrapper {
    display: flex;
    align-items: center;
  }
  .item-wrapper > * {
    flex: 1;
  }
  /deep/ .el-badge {
    padding-right: 2.4em;
  }
  /deep/ .el-badge .el-badge__content.is-fixed{
    position: unset !important;
  }

  /deep/ .el-badge .el-badge__content {
    margin-top: 16px;
    background-color: #F56C6C;
    border-radius: 10px;
    color: #FFF;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 16px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border: 1px solid #FFF;
  }
</style>
