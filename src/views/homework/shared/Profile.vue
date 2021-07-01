<template>
  <div v-if="userInfo.nickname" class="profile">
    <div class="avatar">
      <e-avatar :username="username" :src="avatar" :size="72" :rounded="false" />
    </div>
    <div>
      <h2>
        <router-link to="/homework/account/info">
          {{ userInfo.nickname || "NickName is blank" }}
        </router-link>
      </h2>
      <div class="nickname">@{{ userInfo.username || "user name is blank" }}</div>
    </div>
  </div>
</template>

<script>
import EAvatar from 'vue-avatar'
import { mapGetters } from 'vuex'
export default {
  components: {
    EAvatar
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'userInfo'
    ]),
    username() {
      return this.userInfo.nickname || this.userInfo.username || 'UnNamed'
    }
  }
}
</script>

<style lang="scss" scoped>

  .profile {
    display: flex;
    align-items: center;

    h2 {
      margin: 0;
      font-weight: normal;
      font-size: 1.5em;
      margin: 4px 0;
    }
    .sec-info {
      margin: 4px 0;
      color: #999;
    }

    .avatar {
      box-sizing: border-box;
      flex: 0 0 72px;
      width: 72px;
      height: 72px;
      // border-radius: 50%;s
      background: #efefef;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-right: 1em;

      border-radius: 4px;
      overflow: hidden;
    }

    .nickname {
      color: #999;
    }
  }
</style>
