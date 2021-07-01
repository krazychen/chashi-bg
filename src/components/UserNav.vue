<template>
  <div class="user-nav">
    <div />
    <el-dropdown v-if="hasToken()" class="avatar-container" trigger="click" @command="setRoleType">
      <div class="avatar-wrapper">
        <e-avatar :username="username" :src="avatar" :size="32" :rounded="true" />
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <el-dropdown-item v-for="[roleType, route] in availableRoutes" :key="roleType.type + route.path" :command="{roleType,route,logoutFlag:0}">
          <!--          <router-link :to="route.path" @click.native="setRoleType(roleType.type)">-->
          <span>{{ roleType.name }}</span>
          <!--            {{ roleType.name }}-->
          <!--          </router-link>-->
        </el-dropdown-item>

        <el-dropdown-item divided :command="{roleType:null,route:null,logoutFlag:1}">
          <span style="display:block;">Logout</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { roleTypeRoutes } from '@/router'
import { mapGetters } from 'vuex'
import EAvatar from 'vue-avatar'
import { getToken, getTokenKeyValue } from '@/utils/auth' // get token from cookie

export default {
  components: {
    EAvatar
  },
  computed: {
    ...mapGetters([
      'avatar',
      'userInfo',
      'roleTypes',
      'currentRoleType'
    ]),
    username() {
      return (this.userInfo && this.userInfo.nickname) || (this.userInfo && this.userInfo.username) || 'UnNamed'
    },
    availableRoutes() {
      const routes = []
      this.roleTypes.forEach(rt => {
        const rs = roleTypeRoutes[rt.type]
        console.log(rt.type, rs)
        if (rs) {
          routes.push([rt, rs[0]])
        }
      })
      console.log(roleTypeRoutes)
      console.log(routes)
      return routes
    }
  },
  methods: {
    hasToken() {
      return getToken()
    },
    async setRoleType(roleObj) {
      if (roleObj.logoutFlag === 1) {
        this.logout()
      } else {
        if (roleObj.roleType.type !== this.currentRoleType) {
          await this.$store.commit('user/SET_CURRENT_ROLE_TYPE', roleObj.roleType.type)
          await this.$store.commit('permission/RESET')
          if (roleObj.route.redirect) {
            this.$router.push(roleObj.route.redirect)
          } else {
            this.$router.push(roleObj.route.path)
          }
        }
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // 避免因为点击退出登录，切换了学员或者老师账号重新登录导致跳转错误
      const iswx = getTokenKeyValue('iswx') === 'true'
      if (iswx) {
        this.$router.push(`/wx`)
      } else {
        this.$router.push(`/login`)
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      }
      /* this.$router.push(`/login?redirect=${this.$route.fullPath}`)*/
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-nav {
    display: flex;
    align-items: center;
    margin-right: 1em;
  }
</style>
