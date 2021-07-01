<template>
  <teacherForm :current-teacher="'1'" :view-details="viewDetails" />
</template>

<script>
import teacherForm from './teacherForm'
export default {
  name: 'TeacherFormOneFrameVue',
  components: { teacherForm },
  methods: {
    viewDetails(row) {
      // 跳转到详情页
      this.$router.push({
        path: '/homeworkAud/teacherForm/class/classs/',
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
