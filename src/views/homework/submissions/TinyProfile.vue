<template>
  <div class="tiny-profile">
    <e-avatar :username="user.username" :src="user.avatar" :size="18" :rounded="false" />

    <span class="username">{{ user.username }} ({{ user.nickname }})</span>
  </div>
</template>

<script>
import EAvatar from 'vue-avatar'

export default {
  components: {
    EAvatar
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {
        avatar: null,
        username: 'UserName'
      }
    }
  },
  mounted() {
    if (this.userId) {
      this.$store.dispatch('users/getUserInfo', { userId: this.userId }).then(user => {
        this.user = user

        this.$nextTick(() => {
          this.$emit('loaded')
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tiny-profile {
    display: flex;
    align-items: center;
    margin-right: .5em;
  }
  .tiny-profile .vue-avatar--wrapper {
    margin-right: .5em;
  }
</style>
