<template>
  <div class="app-wrapper">
    <div class="container">
      <div class="box">
        <navbar />
        <slot />
      </div>
    </div>

  </div>
</template>

<script>
import Navbar from '@/views/homework/shared/Navbar'

export default {
  name: 'Dashboard',
  components: {
    Navbar
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
