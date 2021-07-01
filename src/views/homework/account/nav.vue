<template>
  <el-menu :default-active="index" mode="horizontal" size="small">
    <el-menu-item v-for="item in items" :key="item[1]" :index="item[1]">
      <router-link :to="item[1]">
        {{ item[0] }}
      </router-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { getLocalStorageKeyValue } from '@/utils/auth'
export default {
  props: {
    index: {
      type: String,
      default: '/homework/account/info'
    }
  },
  data() {
    return {
      items: [
        ['资料设置', '/homework/account/info'],
        ['报考资料', '/homework/account/student'],
        ['修改密码', '/homework/account/changePassword']
      ]
    }
  },
  created() {
    const data = JSON.parse(getLocalStorageKeyValue('user'))
    const sysRoleList = data.sysRoleList
    if (sysRoleList && sysRoleList[0]) {
      const type = sysRoleList[0].type
      if (type === 'student' || type === 'studentnowx') {
        this.items = [
          ['资料设置', '/homework/account/info'],
          ['报考资料', '/homework/account/student'],
          ['修改密码', '/homework/account/changePassword']
        ]
      } else if (type === 'leve2teacher') {
        this.items = [
          ['资料设置', '/system/account/info'],
          ['修改密码', '/system/account/changePassword']
        ]
      } else {
        this.items = [
          ['资料设置', '/homework/account/info'],
          ['修改密码', '/homework/account/changePassword']
        ]
      }
    }
  }
}
</script>

<style>
  .el-menu--horizontal > .el-menu-item a {
    display: flex;
    height: 100%;
    width: 100%;
  }
</style>
