<template>
  <div class="app-container">
    <div class="layout-no-cols right-list-panel-card right-list-toolbar">
      <div class="el-toolbar" style="padding-top:20px;">
        <el-row>
          <el-col :span="12">
            <div id="echartss" style="width: 98%;height: 350px;border:1px solid rgb(180,180,180)" />
          </el-col>
          <div style="margin-right: 15px;" />
          <el-col :span="12">
            <el-row>
              <el-col :span="11" style="margin-right: 10px;">
                <div style="border:1px outset rgb(180,180,180);height: 165px;">
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">{{ wxusers }}位</div>
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">用户数据</div>
                </div>
              </el-col>
              <el-col :span="11">
                <div style="border:1px outset rgb(180,180,180);height: 165px;">
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">{{ orderNums }}单</div>
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">订单数量</div>
                </div>
              </el-col>
            </el-row>
            <div style="margin-top: 19px;" />
            <el-row>
              <el-col :span="11" style="margin-right: 10px;">
                <div style="border:1px outset rgb(180,180,180);height: 165px;">
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">{{ orderPrices }}元</div>
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">总收益</div>
                </div>
              </el-col>
              <el-col :span="11">
                <div style="border:1px outset rgb(180,180,180);height: 165px;">
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">{{ merchantNums }}家</div>
                  <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">商家数量</div>
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row />
        <div style="margin-top: 15px;" />
        <el-row>
          <el-col :span="20" />
        </el-row>
        <div style="margin-top: 15px;" />
        <el-row style=" width:97%;border:1px outset rgb(180,180,180);height: 165px;">
          <el-col :span="6">
            <div>
              <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">订单总收入</div>
              <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">{{ orderPrices }}元</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 36px;font-size:25px">今日收入</div>
              <div style="display:flex;flex-direction:column;justify-content:space-between;align-items:start;padding-left:50px;padding-top: 30px;font-size:16px">{{ currentPrices }}元</div>
            </div>
          </el-col>
          <el-col :span="12" />
        </el-row>

      </div>
    </div>
  </div>
</template>

<script>
import { getCsMerchantOrderTotal, getCsMerchantTotalStatical } from '@/api/chashi/csMerchantOrder'
import { getDateBefore, roundFun } from '../../utils'
import * as echarts from 'echarts'
import downloadPNG from '../../icons/download.png'
export default {
  components: {
    // 'v-chart': ECharts
  },
  data() {
    return {
      myChart: null,
      dataArr: [],
      dataList: null,
      wxusers: 0,
      orderNums: 0,
      orderPrices: 0,
      merchantNums: 0,
      currentPrices: 0,
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
        // toolbox: {
        //   right: 10,
        //   top: 10,
        //   feature: {
        //     myTool2: {
        //       show: true,
        //       title: '下载',
        //       icon: 'image://' + downloadPNG,
        //       onclick: function() {
        //         alert('myToolHandler2')
        //       }
        //     }
        //   }
        // },
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
  // 挂载前初始化echarts实例
  mounted: function() {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = echarts.init(document.getElementById('echartss'))
    // 绘制图表，this.echarts1_option是数据
    this.myChart.setOption(this.lineOption)
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const dateList = getDateBefore(new Date())
      const that = this
      getCsMerchantOrderTotal({ }).then(response => {
        that.datalist = response.data.records
        dateList.forEach(function(obj) {
          const option = []
          option.push(obj)
          for (let i = 0; i < that.datalist.length; i++) {
            let ldate = that.datalist[i].orderDate.split(' ')[0]
            ldate = ldate.replaceAll('-', '/')
            if (ldate === obj) {
              option.push(that.datalist[i].orderNums)
              break
            }
          }
          if (option.length !== 2) {
            option.push(0)
          }
          // console.log(option)
          that.dataArr.push(option)
        })
        console.log(that.dataArr)
        const data = [
          {
            type: 'orders',
            name: '茶室订单',
            data: that.dataArr
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

        getCsMerchantTotalStatical().then(response => {
          const data = response.data
          console.log(data)
          this.wxusers = data.wxusers
          this.orderNums = data.orderNums
          this.orderPrices = roundFun(data.orderPrices, 2)
          this.merchantNums = data.merchantNums

          const currentDate = that.dataArr[0][0]
          console.log(currentDate)
          for (let i = 0; i < that.datalist.length; i++) {
            let ldate = that.datalist[i].orderDate.split(' ')[0]
            ldate = ldate.replaceAll('-', '/')
            if (ldate === currentDate) {
              this.currentPrices = roundFun(that.datalist[i].orderPrices, 2)
              break
            }
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.echarts{
  width:800px
}
</style>
