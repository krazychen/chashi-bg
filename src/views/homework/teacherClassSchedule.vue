<template>
  <div>
    <full-calendar
      ref="calendar"
      :search="search"
      :handle-event-click="handleEventClick"
      :header-toolbar="headerToolbar"
      :is-color="isColor"
      :event-start-editable="false"
      :event-duration-editable="false"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="355px" @closed="closeAfter">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 315px;">
        <el-form-item label="名称" prop="scheduleName">
          <el-input
            v-model="temp.scheduleName"
            placeholder="请输入名称"
            :style="selectwidthz"
            :disabled="disabled"
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="scheduleStartTime">
          <el-date-picker
            v-model="temp.scheduleStartTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            :style="selectwidthz"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="scheduleEndTime">
          <el-date-picker
            v-model="temp.scheduleEndTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
            :style="selectwidthz"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item label="班级标签" prop="scheduleClassTypes">
          <el-select v-model="temp.scheduleClassTypes" placeholder="请选择班级标签" clearable :multiple="true" class="filter-item" :style="selectwidthz" :disabled="disabled" @change="classChange">
            <el-option v-for="item in typeIds" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="temp.remarks" type="textarea" maxlength="200" :show-word-limit="true" placeholder="请输入备注信息" :style="selectwidthz" :disabled="disabled" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import FullCalendar from '@/components/Schedule'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'
import { getScheduleInfo } from '@/api/system/schedule.js'
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: function() {
    return {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      isColor: false,
      eventData: [],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        scheduleName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        scheduleStartTime: [{ required: true, message: '请选择课程开始时间', trigger: 'change' }],
        scheduleEndTime: [{ required: true, message: '请选择课程结束时间', trigger: 'change' }],
        scheduleClassType: [{ required: true, message: '请选择班级标签', trigger: 'blur' }],
        remarks: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      temp: {
        id: '',
        scheduleName: '', // 名称
        scheduleStartTime: '', // 课程开始时间
        scheduleEndTime: '', // 课程结束时间
        scheduleClassTypes: [],
        scheduleClassType: '',
        remarks: ''
      },
      selectInfo: {},
      typeIds: [],
      dialogFormVisible: false,
      disabled: true,
      dialogStatus: 'create',
      currentEvents: [],
      pickerOptions: {}
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '205px'
      }
    }
  },
  created() {
    getHwClassTypeAll({ status: 1 }).then(response => {
      this.typeIds = response.data
    })
    // this.search()
  },
  methods: {
    closeAfter() {
      this.restTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    restTemp() {
      this.temp = {
        id: '',
        scheduleName: '', // 名称
        scheduleStartTime: '', // 课程开始时间
        scheduleEndTime: '', // 课程结束时间
        scheduleClassType: '',
        remarks: ''
      }
    },
    handleEventClick(clickInfo) {
      // 编辑
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.selectInfo = clickInfo
      this.temp = JSON.parse(JSON.stringify(this.selectInfo.event._def.extendedProps.extendedProp))
      this.temp.scheduleClassTypes = this.temp.scheduleClassType.split(',')
      /*      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }*/
    },
    lengthUtil(value, len, va) {
      if (value === '') {
        this.temp[va] = value
        return
      }
      const vals = value.replace(/\s/g, '')
      this.temp[va] = vals
      if (vals.length > len) {
        this.temp[va] = vals.slice(0, len)
      }
    },
    search() {
      getScheduleInfo().then(res => {
        if (res.success) {
          this.$refs.calendar.setEvents(res.data)
        }
      })
    },
    classChange(e) {
      const that = this
      that.temp.scheduleClassType = ''
      e.forEach(function(a) {
        that.temp.scheduleClassType += '' + a + ','
      })
      that.temp.scheduleClassType = this.temp.scheduleClassType.substring(0, this.temp.scheduleClassType.length - 1)
      console.log(that.temp.scheduleClassType)
    },
    timeSetting(time) {
      debugger
      /* return time = new Date(this.temp.startTime)*/
    },
    formatDate(date) {
      if (date) {
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        var minute = date.getMinutes()
        minute = minute < 10 ? ('0' + minute) : minute
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute
      }
    },
    contentEvent(arg) {

    }
  }
}
</script>

<style lang='css'>

  .del{
    margin-left: 10px;
    margin-right: 10px;
  }

  /*.fc-myCustomButton-button{
    background-color: #f56c6c !important;
    border-color: #f56c6c !important;
    opacity:1
  }

  .fc-button-active{
    border-color: #f56c6c !important;
  }*/
</style>
