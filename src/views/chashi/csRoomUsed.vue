<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.tearoomId" placeholder="请选择茶室" @change="changeTearoom">
        <el-option
          v-for="item in roomOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker v-model="listQuery.orderDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <br>
    <el-tag>预定情况：蓝色为营业时间，暗红色为被预定时间段</el-tag><br><br>
    <div class="time-grid-div">
      <div
        v-for="item in roomBookingTimeRange"
        :key="item.bookingItemStartTime"
        :class="item.bookingClass"
      >
        {{ item.bookingItemStartTime }} - {{ item.bookingItemEndTime }}

      </div>
    </div>
  </div>
</template>

<script>
import { getRoomList, getRoomDetailInfo } from '@/api/chashi/csRoom'
import { getLoginSysUserVo } from '@/utils/auth'
import waves from '@/directive/waves'
import { getMerchant } from '@/api/chashi/csMerchant' // waves directive
import { getTimeRange } from '@/api/chashi/csMerchantOrder'

export default {
  name: 'CsRoomUsed',
  directives: { waves },
  data() {
    return {
      userInfo: '',
      merchant: '',
      merchantId: '',
      listQuery: {
        orderDate: '',
        tearoomId: ''
      },
      roomOptions: [],
      roomList: [],
      tearoom: '',
      timeRage: '',
      startTime: '',
      endTime: '',
      opsTimes: [],
      roomBookingTimeRange: [],
    }
  },
  mounted() {
  },
  beforeCreate() {
  },
  created() {
    this.getMerchantAndRoomList()
  },
  methods: {
    getMerchantAndRoomList() {
      const that = this
      // 获取当前的用户
      this.userInfo = getLoginSysUserVo()
      getMerchant(this.userInfo.officeCode).then(response => {
        that.merchant = response.data
        that.merchantId = response.data.id
        that.startTime = that.merchant.startTime
        that.endTime = that.merchant.endTime
        getRoomList({ 'merchantId': that.merchantId }).then(response => {
          const optionss = []
          that.roomList = response.data.records
          that.roomList.forEach(function(obj) {
            const option = { value: obj.id, label: obj.roomName }
            optionss.push(option)
          })
          that.roomOptions = optionss
        })
      })
    },
    changeTearoom(event) {
      const that = this
      this.roomList.forEach(function(obj, index) {
        // console.log(obj)
        if (obj.id === event) {
          that.tearoom = obj
        }
      })
    },
    handleFilter() {
      if (this.listQuery.tearoomId.trim() === '') {
        this.$message('请选择要查询的茶室！')
        return
      }
      if (this.listQuery.orderDate === '') {
        this.$message('请选择要查询的日期！')
        return
      }
      getRoomDetailInfo(this.listQuery.tearoomId).then(res => {
        const roomDetail = res.data || null
        if (roomDetail !== null) {
          this.roomBookingTimeRange = []
          const minBookingTime = roomDetail.timeRange ? Number(roomDetail.timeRange) : 0.5
          const merchantStartTimeArr = this.startTime.split(':')
          const merchantEndTimeArr = this.endTime.split(':')
          const merchantStart = Number(merchantStartTimeArr[0] + merchantStartTimeArr[1])
          const merchantEnd = Number(merchantEndTimeArr[0] + merchantEndTimeArr[1])
          let beginLoop = merchantStart
          while (beginLoop < merchantEnd) {
            let hourNo = parseInt((minBookingTime / 0.5 / 2))
            const minuteNo = ((minBookingTime / 0.5 / 2) - hourNo) * 60
            let beginHour = (beginLoop + '').substring(0, (beginLoop + '').length - 2)
            const beginMin = (beginLoop + '').substring((beginLoop + '').length - 2).padStart(2, '0')
            if (beginLoop === 0 || beginHour === '') {
              beginHour = '0'
            }
            let endMin = beginMin
            if (beginLoop === 0) {
              endMin = '00'
            }
            if (minuteNo > 0) {
              const computeMin = Number(beginMin) + minuteNo - 60
              if (computeMin >= 0) {
                hourNo = hourNo + 1
              }
              endMin = Math.abs(Number(beginMin) + minuteNo - 60) + ''
              if (endMin === '60' || endMin === '0') {
                endMin = '00'
              }
            }
            const bookingTimeObj = {}
            bookingTimeObj.bookingItemStartTime = beginHour + ':' + beginMin
            bookingTimeObj.bookingItemStartTimeNum = Number(beginHour + '' + beginMin)
            bookingTimeObj.bookingItemEndTime = (Number(beginHour) + hourNo) + ':' + endMin
            bookingTimeObj.bookingItemEndTimeNum = Number(Number(beginHour) + hourNo + '' + endMin)
            bookingTimeObj.bookingStatus = 1
            bookingTimeObj.bookingClass = 'time-grid-item'
            beginLoop = Number(Number(beginHour) + hourNo + '' + endMin)
            if (beginLoop > merchantEnd) {
              break
            }
            this.roomBookingTimeRange.push(bookingTimeObj)
          }
          getTimeRange(this.listQuery).then(response => {
            if (response.data && response.data !== null && response.data !== '') {
              this.timeRage = response.data.split(',')
              this.timeRage.forEach(bookedItem => {
                const bookedItemArr = bookedItem.split('-')
                const bookedStartTime = Number(bookedItemArr[0].replace(':', ''))
                const bookedEndTime = Number(bookedItemArr[1].replace(':', ''))
                this.roomBookingTimeRange.forEach(bookingTimeObj => {
                  const bookingTimeStr = bookingTimeObj.bookingItemStartTime + '-' + bookingTimeObj.bookingItemEndTime
                  if (bookingTimeStr === bookedItem || (bookingTimeObj.bookingItemStartTimeNum <= bookedStartTime && bookingTimeObj.bookingItemEndTimeNum === bookedEndTime)) {
                    bookingTimeObj.bookingStatus = 0
                    bookingTimeObj.bookingClass = 'time-grid-item-booked'
                  }
                })
              })
            }
          })
        } else {
          this.roomBookingTimeRange = []
        }
      })
    }
  }
}
</script>

<style>

.filter-container div {
    margin-right: 10px;
}

  .time-grid-div{
    width:100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }

  .time-grid-item{
    width:15%;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
    border-radius: 4px;
    font-size:19px;
    text-align:center;
    background: #82b1e6;
  }

  .time-grid-item-booked{
    width:15%;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
    border-radius: 4px;
    font-size:19px;
    text-align:center;
    background: #d95f5f;
  }
</style>
