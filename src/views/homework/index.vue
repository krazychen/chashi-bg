<template>
  <div class="app-wrapper">
    <top-nav />

    <div class="container">
      <el-row :gutter="20">
<!--        <el-col :span="6">-->
<!--          <profile class="box" style="margin-bottom: 20px;" />-->
<!--          <sidebar :prefix="prefix" :default-openeds="['/homework']" class="box" />-->
<!--        </el-col>-->
        <el-col>
<!--          <el-col :span="18">-->
          <!-- <countdown class='box' style="margin-bottom: 20px;" /> -->
          <div class="box" style="padding-top: 10px;">
            <navbar />
            <child-view />
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import TopNav from '@/views/homework/shared/TopNav'
import Navbar from '@/views/homework/shared/Navbar'
import Sidebar from '@/views/homework/shared/Sidebar'
import ChildView from '@/views/homework/shared/ChildView'
import Profile from '@/views/homework/shared/Profile'
// import Countdown from '@/views/homework/shared/Countdown'

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    TopNav,
    Sidebar,
    ChildView,
    Profile
    // Countdown
  },
  data() {
    return {
      prefix: ['pub:student', 'pub:teacher']
    }
  }
}
</script>

<style lang="scss">
  @import "@/views/homework/shared/StyleFix.scss";
  body {
    background: #f7f7f7;
  }
</style>

<style lang="scss" scoped>
  /deep/ .container {
    max-width: 1140px;
    margin: 0em auto;
  }

  .app-wrapper {
    font-size: 13px;
  }
</style>
