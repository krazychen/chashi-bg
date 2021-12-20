<template>
  <div class="app-container">
    <div class="layout-no-cols right-list-panel-card right-list-toolbar">
      <div class="el-toolbar">
        <el-row>
          <el-col :span="12">
            <div style="width: 98%;height: 350px;border:1px solid rgb(180,180,180)" id="echartss"></div>
          </el-col>
          <div style="margin-right: 15px;" />
          <el-col :span="12">
            <el-row>
              <el-col :span="12" >
                <div style="height: 45%;">用户数据</div>
              </el-col>
              <el-col :span="12">订单数量</el-col>
            </el-row>
            <div style="margin-top: 15px;" />
            <el-row>
              <el-col :span="12">总收益</el-col>
              <el-col :span="12">商家数量</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <div style="margin-top: 15px;" />
        <el-row>
          <el-col :span="20">
          </el-col>
        </el-row>
        <div style="margin-top: 15px;" />
        <el-row>
          <el-col :span="6">
            订单总收入
          </el-col>
          <el-col :span="6">
            今日收入
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import downloadPNG from '../../icons/download.png'
export default {
  components: {
    // 'v-chart': ECharts
  },
  // 挂载前初始化echarts实例
  mounted: function() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('echartss'))
    // 绘制图表，this.echarts1_option是数据
    this.myChart.setOption(this.lineOption)
  },
  data() {
    return {
      myChart: null,
      lineOption: {
        title: {
          text: '实时订单数',
          padding: 15
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            var text = '--'
            if (params && params.length) {
              text = params[0].data[0] // 提示框顶部的日期标题
              params.forEach(item => {
                const dotHtml = item.marker // 提示框示例的小圆圈,可以在这里修改
                text += `</br>${dotHtml}${item.seriesName} : ${item.data[1] ? item.data[1] : '-'}`
              })
            }
            return text
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          right: 10,
          top: 10,
          feature: {
            myTool2: {
              show: true,
              title: '下载',
              icon: 'image://' + downloadPNG,
              onclick: function() {
                alert('myToolHandler2')
              }
            }
          }
        },
        xAxis: {
          type: 'time', // type为time时,不要传xAxis.data的值,x轴坐标的数据会根据传入的时间自动展示
          boundaryGap: true, // false横坐标两边不需要留白
          axisLabel: { // 坐标轴标签样式设置
            formatter: function(value, index) { // 坐标轴文字展示样式处理
              const date = new Date(value)
              const texts = [date.getFullYear(), (date.getMonth() + 1), date.getDate()]
              return texts.join('-')
              // echarts自带的日期格式化方法
              // return echarts.format.formatTime('yyyy-MM-dd', value)
            },
            showMaxLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const data = [
        {
          type: 'orders',
          name: '茶室订单',
          data: [
            ['2020-10-1', 450],
            ['2020-10-2', 350],
            ['2020-10-3', 290],
            ['2020-10-4', 380],
            ['2020-10-5', 540],
            ['2020-10-6', 200],
            ['2020-10-7', 50]
          ]
        }
      ]
      const series = []
      const legendData = []
      data.forEach(item => {
        const obj = {
          name: item.name,
          type: 'line',
          data: item.data
        }
        legendData.push(item.name)
        series.push(obj)
      })
      this.lineOption.legend.data = legendData
      this.lineOption.series = series
      // 第二个参数true表示清空之前的echarts设置,重新设置option,适用于legend等数据变化
      // 如果只是渲染数据变化可以不传,lenged等不会重新渲染
      this.myChart.setOption(this.lineOption, true)
    }
  }
}
</script>

<style scoped>
.echarts{
  width:800px
}
</style>
