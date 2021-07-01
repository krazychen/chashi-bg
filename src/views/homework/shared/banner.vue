<template>
  <div class="profile-container">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6">
          <profile class="box" />
        </el-col>
        <el-col :span="18">
          <countdown class="box" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Profile from '@/views/homework/shared/Profile'
import Countdown from '@/views/homework/shared/Countdown'
export default {
  components: {
    Profile,
    Countdown
  }
}
</script>

<style lang="scss" scoped>
  .profile-container {
    margin-bottom: 20px;
  }
</style>
