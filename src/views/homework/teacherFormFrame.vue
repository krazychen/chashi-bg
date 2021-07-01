<template>
  <teacherForm :view-details="viewDetails" />
</template>

<script>
import teacherForm from './teacherForm'
export default {
  name: 'TeacherFormFrameVue',
  components: { teacherForm },
  methods: {
    viewDetails(row) {
      // 跳转到详情页
      this.$router.push({
        path: '/system/homework/teacherForm/class/classs/',
        query: {
          row: row
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
