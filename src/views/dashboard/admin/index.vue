<template>
  <div class="dashboard-editor-container">

    <panel-group :head-query-vo="headQueryVo" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :keys="keys" />
    </el-row>

    <el-row :gutter="8" style="height: 800px">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 10}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table/>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 14}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table1/>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TransactionTable from './components/TransactionTable'
import TransactionTable1 from './components/TransactionTable1'
import { getStatistics, getSchoolAndCollegeStuPageList, getStudentDetailsPageList } from '@/api/score/score'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    TransactionTable,
    TransactionTable1
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      headQueryVo: {},
      keys: [],
      list1: [],
      list2: []
    }
  },
  mounted() {
    const data = { createTime: new Date() }
    getStatistics(data).then(res => {
      console.log(res.data)
      this.headQueryVo = res.data.headQueryVo
      const listAddDaily = res.data.listAddDaily
      const listAddKey = []
      const listAddValue = []
      const listDailyAuth = res.data.listDailyAuth
      const listAuthValue = []
      listAddDaily.forEach(function(a, b) {
        for (const key in a) {
          const c = listDailyAuth[b]
          if (key === 'createTime') {
            listAddKey.push(a[key])
          } else {
            listAddValue.push(a[key])
            listAuthValue.push(c[key])
          }
        }
      })
      const lineChartData = {}
      lineChartData['expectedData'] = listAddValue
      lineChartData['actualData'] = listAuthValue
      this.lineChartData = lineChartData
      this.keys = listAddKey
    })
    this.fetchData1()
    this.fetchData2()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
