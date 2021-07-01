<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in relatedRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { isExternal } from '@/utils/validate'
// import Hamburger from '@/components/Hamburger'
import SidebarItem from '@/views/homework/shared/SidebarItem'
import variables from '@/styles/variables.scss'
import { getTokenKeyValue } from '@/utils/auth' // get token from cookie

export default {
  components: {
    SidebarItem
  },
  props: {
    prefix: {
      type: Array,
      default: () => []
    },
    defaultOpeneds: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'accessableRoutes',
      'roleTypes'
    ]),
    relatedRoutes() {
      if (!this.accessableRoutes) {
        return []
      }
      return this.accessableRoutes.filter(route => {
        if (route.hidden) return false
        if (!route.meta || !route.meta.roles) return false

        return route.meta.roles.some(role => this.prefix.some(str => role.startsWith(str)))
      })
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
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

<style lang="scss" scoped>

  /deep/ .fa {
    margin-right: 10px;
    font-size: 1.4em;

    background: #4f93f0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 4px;
  }

  /deep/ .el-menu {
    border-right: none;
  }

  /deep/ .el-submenu__title {
    display: none !important;
  }

  /deep/ .el-menu-item,
  /deep/ .el-submenu__title {
    height: 40px;
    line-height: initial;
    display: flex;
    align-items: center;
    border-radius: 2px;
    padding: 0 4px !important;
  }
  /deep/ .el-menu-item.is-active i {
    color: #fff;
  }
  /deep/ .el-menu-item.el-menu-item.is-active {
    background-color: #ecf5ff;
  }
</style>
