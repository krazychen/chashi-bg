<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.tearoomId" placeholder="请选择茶室" @change="changeTearoom">
        <el-option
          v-for="item in roomOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker v-model="listQuery.orderDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <br/>
    <el-tag>预定情况：灰色为非营业时间，蓝色为营业时间，暗红色为被预定时间段</el-tag><br/><br/>

    <el-row :gutter="10">
      <el-col :span="4"><div v-bind:class="myclass0">00:00-01:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass1">01:00-02:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass2">02:00-03:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass3">03:00-04:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass4">04:00-05:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass5">05:00-06:00</div></el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="4"><div v-bind:class="myclass6">06:00-07:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass7">07:00-08:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass8">08:00-09:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass9">09:00-10:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass10">10:00-11:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass11">11:00-12:00</div></el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="4"><div v-bind:class="myclass12">12:00-13:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass13">13:00-14:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass14">14:00-15:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass15">15:00-16:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass16">16:00-17:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass17">17:00-18:00</div></el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="4"><div v-bind:class="myclass18">18:00-19:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass19">19:00-20:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass20">20:00-21:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass21">21:00-22:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass22">22:00-23:00</div></el-col>
      <el-col :span="4"><div v-bind:class="myclass23">23:00-24:00</div></el-col>
    </el-row>

  </div>
</template>

<script>
import { getRoomList } from '@/api/chashi/csRoom'
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
      myclass0: 'time-grid-content time-time-bg-purple-light',
      myclass1: 'time-grid-content time-time-bg-purple-light',
      myclass2: 'time-grid-content time-time-bg-purple-light',
      myclass3: 'time-grid-content time-time-bg-purple-light',
      myclass4: 'time-grid-content time-time-bg-purple-light',
      myclass5: 'time-grid-content time-time-bg-purple-light',
      myclass6: 'time-grid-content time-time-bg-purple-light',
      myclass7: 'time-grid-content time-time-bg-purple-light',
      myclass8: 'time-grid-content time-time-bg-purple-light',
      myclass9: 'time-grid-content time-time-bg-purple-light',
      myclass10: 'time-grid-content time-time-bg-purple-light',
      myclass11: 'time-grid-content time-time-bg-purple-light',
      myclass12: 'time-grid-content time-time-bg-purple-light',
      myclass13: 'time-grid-content time-time-bg-purple-light',
      myclass14: 'time-grid-content time-time-bg-purple-light',
      myclass15: 'time-grid-content time-time-bg-purple-light',
      myclass16: 'time-grid-content time-time-bg-purple-light',
      myclass17: 'time-grid-content time-time-bg-purple-light',
      myclass18: 'time-grid-content time-time-bg-purple-light',
      myclass19: 'time-grid-content time-time-bg-purple-light',
      myclass20: 'time-grid-content time-time-bg-purple-light',
      myclass21: 'time-grid-content time-time-bg-purple-light',
      myclass22: 'time-grid-content time-time-bg-purple-light',
      myclass23: 'time-grid-content time-time-bg-purple-light'
    }
  },
  mounted() {
    const that = this
    // 获取当前的用户
    this.userInfo = getLoginSysUserVo()
    getMerchant(this.userInfo.officeCode).then(response => {
      that.merchant = response.data
      that.merchantId = response.data.id
      that.startTime = that.merchant.startTime
      that.endTime = that.merchant.endTime
      // console.log(parseInt(that.startTime.substr(0, 2)))
      // console.log(parseInt(that.endTime.substr(0, 2)))
      const times = parseInt(that.endTime.substr(0, 2)) - parseInt(that.startTime.substr(0, 2))
      // console.log(times)
      let tempStartTime = that.startTime
      let tempEndTime = ''
      for (let i = 0; i < times; i++) {
        const tempTime = parseInt(that.startTime.substr(0, 2)) + i + 1
        if (tempTime < 10) {
          tempEndTime = '0' + tempTime + ':' + '00'
        } else {
          tempEndTime = tempTime + ':' + '00'
        }
        that.opsTimes.push(tempStartTime + '-' + tempEndTime)
        tempStartTime = tempEndTime
      }
      that.changeOpsColor(that.opsTimes)
      console.log(that.opsTimes)
      getRoomList({ 'merchantId': that.merchantId }).then(response => {
        const optionss = [{}]
        that.roomList = response.data.records
        that.roomList.forEach(function(obj) {
          const option = { value: obj.id, label: obj.roomName }
          optionss.push(option)
        })
        that.roomOptions = optionss
      })
    })
  },
  beforeCreate() {
  },
  created() {
  },
  methods: {
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
      console.log(this.listQuery.tearoomId === '')
      console.log(this.listQuery.orderDate)
      if (this.listQuery.tearoomId.trim() === '') {
        this.$message('请选择要查询的茶室！')
        return
      }
      if (this.listQuery.orderDate === '') {
        this.$message('请选择要查询的日期！')
        return
      }
      getTimeRange(this.listQuery).then(response => {
        console.log(response)
        if (response.data !== null) {
          this.timeRage = response.data.split(',')
          console.log(this.timeRage)
          this.changeUsedColor(this.timeRage)
        }
      })
    },
    changeUsedColor(usedTimes) {
      const that = this
      usedTimes.forEach(function(opsTime) {
        switch (opsTime) {
          case '00:00-01:00':
            that.myclass0 = 'time-grid-content time-bg-purple-dark'
            break
          case '01:00-02:00':
            that.myclass1 = 'time-grid-content time-bg-purple-dark'
            break
          case '02:00-03:00':
            that.myclass2 = 'time-grid-content time-bg-purple-dark'
            break
          case '03:00-04:00':
            that.myclass3 = 'time-grid-content time-bg-purple-dark'
            break
          case '04:00-05:00':
            that.myclass4 = 'time-grid-content time-bg-purple-dark'
            break
          case '05:00-06:00':
            that.myclass5 = 'time-grid-content time-bg-purple-dark'
            break
          case '06:00-07:00':
            that.myclass6 = 'time-grid-content time-bg-purple-dark'
            break
          case '07:00-08:00':
            that.myclass7 = 'time-grid-content time-bg-purple-dark'
            break
          case '08:00-09:00':
            that.myclass8 = 'time-grid-content time-bg-purple-dark'
            break
          case '09:00-10:00':
            that.myclass9 = 'time-grid-content time-bg-purple-dark'
            break
          case '10:00-11:00':
            that.myclass10 = 'time-grid-content time-bg-purple-dark'
            break
          case '11:00-12:00':
            that.myclass11 = 'time-grid-content time-bg-purple-dark'
            break
          case '12:00-13:00':
            that.myclass12 = 'time-grid-content time-bg-purple-dark'
            break
          case '13:00-14:00':
            that.myclass13 = 'time-grid-content time-bg-purple-dark'
            break
          case '14:00-15:00':
            that.myclass14 = 'time-grid-content time-bg-purple-dark'
            break
          case '15:00-16:00':
            that.myclass15 = 'time-grid-content time-bg-purple-dark'
            break
          case '16:00-17:00':
            that.myclass16 = 'time-grid-content time-bg-purple-dark'
            break
          case '17:00-18:00':
            that.myclass17 = 'time-grid-content time-bg-purple-dark'
            break
          case '18:00-19:00':
            that.myclass18 = 'time-grid-content time-bg-purple-dark'
            break
          case '19:00-20:00':
            that.myclass19 = 'time-grid-content time-bg-purple-dark'
            break
          case '20:00-21:00':
            that.myclass20 = 'time-grid-content time-bg-purple-dark'
            break
          case '21:00-22:00':
            that.myclass21 = 'time-grid-content time-bg-purple-dark'
            break
          case '22:00-23:00':
            that.myclass22 = 'time-grid-content time-bg-purple-dark'
            break
          case '23:00-24:00':
            that.myclass23 = 'time-grid-content time-bg-purple-dark'
            break
        }
      })
    },
    changeOpsColor(opsTimes) {
      const that = this
      opsTimes.forEach(function(opsTime) {
        switch (opsTime) {
          case '00:00-01:00':
            that.myclass0 = 'time-grid-content time-bg-purple'
            break
          case '01:00-02:00':
            that.myclass1 = 'time-grid-content time-bg-purple'
            break
          case '02:00-03:00':
            that.myclass2 = 'time-grid-content time-bg-purple'
            break
          case '03:00-04:00':
            that.myclass3 = 'time-grid-content time-bg-purple'
            break
          case '04:00-05:00':
            that.myclass4 = 'time-grid-content time-bg-purple'
            break
          case '05:00-06:00':
            that.myclass5 = 'time-grid-content time-bg-purple'
            break
          case '06:00-07:00':
            that.myclass6 = 'time-grid-content time-bg-purple'
            break
          case '07:00-08:00':
            that.myclass7 = 'time-grid-content time-bg-purple'
            break
          case '08:00-09:00':
            that.myclass8 = 'time-grid-content time-bg-purple'
            break
          case '09:00-10:00':
            that.myclass9 = 'time-grid-content time-bg-purple'
            break
          case '10:00-11:00':
            that.myclass10 = 'time-grid-content time-bg-purple'
            break
          case '11:00-12:00':
            that.myclass11 = 'time-grid-content time-bg-purple'
            break
          case '12:00-13:00':
            that.myclass12 = 'time-grid-content time-bg-purple'
            break
          case '13:00-14:00':
            that.myclass13 = 'time-grid-content time-bg-purple'
            break
          case '14:00-15:00':
            that.myclass14 = 'time-grid-content time-bg-purple'
            break
          case '15:00-16:00':
            that.myclass15 = 'time-grid-content time-bg-purple'
            break
          case '16:00-17:00':
            that.myclass16 = 'time-grid-content time-bg-purple'
            break
          case '17:00-18:00':
            that.myclass17 = 'time-grid-content time-bg-purple'
            break
          case '18:00-19:00':
            that.myclass18 = 'time-grid-content time-bg-purple'
            break
          case '19:00-20:00':
            that.myclass19 = 'time-grid-content time-bg-purple'
            break
          case '20:00-21:00':
            that.myclass20 = 'time-grid-content time-bg-purple'
            break
          case '21:00-22:00':
            that.myclass21 = 'time-grid-content time-bg-purple'
            break
          case '22:00-23:00':
            that.myclass22 = 'time-grid-content time-bg-purple'
            break
          case '23:00-24:00':
            that.myclass23 = 'time-grid-content time-bg-purple'
            break
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

.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.time-bg-purple-dark {
  background: #d95f5f;
}
.time-bg-purple {
  background: #82b1e6;
}
.time-time-bg-purple-light {
  background: #e5e9f2;
}
.time-grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 80px;
  text-align:center;
  line-height:80px;
  font-size:19px;
}
</style>
