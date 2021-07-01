<template>
  <report-form :view-details="viewDetails" />
</template>

<script>
import reportForm from './reportForm'
export default {
  name: 'ReportFormFrame',
  components: { reportForm },
  methods: {
    viewDetails(row) {
      const url = '/system/homework/report/class/classs/' + row.id
      this.$router.push(url)
    }
  }
}
</script>

<style scoped>

</style>
