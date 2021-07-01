<template>
  <header>
    <div class="container">
      <el-menu mode="horizontal" class="site-info transparent" text-color="#222">
        <el-menu-item index="1" class="site-name">
          <router-link to="/">
            <div class="logo">
              <img src="@/assets/logo.png" alt="logo">
            </div>
          </router-link>
        </el-menu-item>
          <sidebar-item v-for="route in relatedRoutes" :key="route.path" :item="route" :base-path="route.basePath" />
      </el-menu>
      <user-nav class="right-menu" />
    </div>
  </header>
</template>

<script>
import SidebarItem from '@/views/homework/shared/SidebarItem'
import UserNav from '@/components/UserNav'
import { mapGetters } from 'vuex'
import variables from '@/styles/variables.scss'

export default {
  components: {
    UserNav,
    SidebarItem
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
      const routePathFirst = this.accessableRoutes.filter(route => {
        if (route.hidden) return false
        if (!route.meta || !route.meta.roles) return false
        return route.meta.roles.some(role => this.prefix.some(str => role.startsWith(str)))
      })
      if (routePathFirst && routePathFirst.length > 0) {
        const resultPath = []
        routePathFirst.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(childItem => {
              childItem.basePath = item.path
              resultPath.push(childItem)
            })
          }
        })
        return resultPath
      }
      return []
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
  data() {
    return {
      prefix: ['pub:student']
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    // background-color: #3e59ad;
    // border-top: 1px solid #409EFF;
    // border-bottom: 1px solid #e8e8e8;
    // color: #fff;
    background: #fff;
    margin-bottom: 20px;

    border: 0;
    border-bottom: 1px solid;
    border-image: linear-gradient(139deg, #fb8817, #ff4b01, #c12127, #e02aff) 3;
    border-image: linear-gradient(139deg, #e6e6e8, #d9e1e8, #efcb97, #e0c58a) 3;

    .container {
      display: flex;
      align-items: center;
    }

    .el-menu.transparent,
    .el-menu.transparent > .el-menu-item {
      background: transparent;
    }

    /deep/ .el-menu--horizontal>.el-menu-item {
      // color: #fff;
    }
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
      // color: #fff;
    }

    .site-info {
      // margin-left: 1em;
    }

    .site-name {
      // padding-left: 21px;
      padding-left: 0;
      font-weight: normal;
      font-size: 1.4em;

      display: flex;
      align-items: center;

      .logo {
        display: block;
        // width: 48px;
        height: 60px;

        // border: 1px solid #ccc;
        // border-radius: 2px;

        margin-right: 1em;

        img {
          max-height: 100%;
          max-width: 100%;
          display: block;
        }
      }
    }

    .right-menu {
      margin-left: auto;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        // margin-right: 21px;
        height: 100%;
        display: flex;
        align-items: center;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          display: flex;
          align-items: center;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 2px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }

  /deep/ .el-menu.el-menu--horizontal,
  .el-menu--horizontal>.el-menu-item {
    border: none;
  }

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
</style>
