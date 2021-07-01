<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <hamburger v-if="collapse" key="collapse" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <div v-else class="flex-box center">
        <router-link key="expand" class="sidebar-logo-link" :to="link">
          <h1 class="sidebar-title">{{ title }} </h1>
        </router-link>
        <hamburger key="collapse" :is-active="sidebar.opened" class="hamburger-container" style="flex: 0;" @toggleClick="toggleSideBar" />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Hamburger
  },
  props: {
    collapse: {
      type: Boolean,
      required: true
    },
    link: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      title: '批改系统'
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      // color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
