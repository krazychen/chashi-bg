<template>
  <div>
    <el-aside style="width: auto;">
      <el-menu :default-active="'1'">
        <el-menu-item index="1">
          <i class="el-icon-star-off" /> 所有
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-star-off" /> 新作业
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-star-off" /> 已提交
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-star-off" /> 已完成
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-star-off" /> 待提交
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-star-off" /> 已截止
        </el-menu-item>
      </el-menu>
      <p style="color: #999;">
        最新通知<br>
        下发的作业，回答的提问，下发给学员后，学员未读
      </p>
    </el-aside>
  </div>
</template>

<script>
export default {
  name: 'Aside'
}
</script>

<style scoped>
  .el-menu {
    border: 0;
  }
</style>
