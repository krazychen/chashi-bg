<template>
  <div class="app-wrapper">
    <top-nav />

    <div class="container">
      <div class="box">
        <navbar />
        <slot />
      </div>
    </div>

  </div>
</template>

<script>
import TopNav from '@/views/homework/shared/TopNav'
import Navbar from '@/views/homework/shared/Navbar'

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    TopNav
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
