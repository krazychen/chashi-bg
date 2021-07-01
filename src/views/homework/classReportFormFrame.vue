<template>
  <classReportForm :view-details="viewDetails" />
</template>
<script>
import classReportForm from './classReportForm'
export default {
  name: 'ClassReportFormFrameVue',
  components: { classReportForm },
  methods: {
    viewDetails(id, row) {
      const url = '/system/homework/report/class/student/' + id + '/' + row.id
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>

</style>
