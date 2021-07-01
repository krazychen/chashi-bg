<template>
  <a icon="logout" @click.prevent="logout">
    <svg-icon icon-class="fuck" />
    <span>Log Out</span>
  </a>
</template>

<script>
import { getTokenKeyValue } from '@/utils/auth' // get token from cookie

export default {
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      // 避免因为点击退出登录，切换了学员或者老师账号重新登录导致跳转错误
      const iswx = getTokenKeyValue('iswx') === 'true'
      if (iswx) {
        this.$router.push(`/wx`)
      } else {
        this.$router.push(`/login`)
      }

      /* this.$router.push(`/login?redirect=${this.$route.fullPath}`)*/
    }
  }
}
</script>
