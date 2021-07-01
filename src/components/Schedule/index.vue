<template>

  <div class="app-container">
    <el-row :gutter="20">
      <el-col v-if="isColor" :span="isColor?2:0" style="text-align: center">
        <el-row>
          <el-col :span="24" style="margin-bottom: 10px;">
            <el-tag effect="dark">未开始</el-tag>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px;">
            <el-tag type="success" effect="dark">进行中</el-tag>
          </el-col>
          <el-col :span="24">
            <el-tag type="danger" effect="dark">已结束</el-tag>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="isColor?22:24">
        <FullCalendar
          :options="calendarOptions"
        />
      </el-col>
    </el-row>
  </div>

</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  props: {
    eventDurationEditable: {
      type: Boolean,
      defualt: true
    },
    eventStartEditable: {
      type: Boolean,
      defualt: true
    },
    headerToolbar: {
      type: Object,
      default: null
    },
    handleDateSelect: {
      type: Function,
      default: null
    },
    importDateSelect: {
      type: Function,
      default: null
    },
    isColor: {
      type: Boolean,
      defualt: true
    },
    createData: {
      type: Function,
      default: null
    },
    search: {
      type: Function,
      default: null
    },
    eventDropt: {
      type: Function,
      default: null
    },
    deleteData: {
      type: Function,
      default: null
    },
    handleEventClick: {
      type: Function,
      default: null
    }
  },
  data: function() {
    return {
      START_COLOR: '#409eff',
      LOADING_COLOR: '#67c23a',
      END_COLOR: '#f56c6c',
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
      usernameDisabled: false,
      dialogStatus: 'create',
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        initialView: 'dayGridMonth', // 视图类型
        eventStartEditable: this.eventStartEditable, // 是否允许拖动
        eventDurationEditable: this.eventDurationEditable,
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '日',
          prev: '上月',
          next: '下月'
        }, // 替换工具栏按钮默认名称
        headerToolbar: this.headerToolbar,
        customButtons: {
          myCustomButton: {
            text: '新建', click: this.handleDateSelect
          },
          importButton: {
            text: '导入', click: this.importDateSelect
          }
        },
        height: this.getHeight(),
        allDaySlot: false, // 全天是否显示
        allDayText: '全天',
        firstDay: 1,
        locale: 'zh-cn', // 语言
        dayPopoverFormat: {
          month: 'long', day: 'numeric', year: 'numeric'
        },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }, // 设置242小时展示侧边时间
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        },
        slotEventOverlap: false,
        slotMinTime: '06:00',
        slotMaxTime: '24:00',
        slotDuration: '01:00:00', // 从什么时候开始到什么时候结束，中间间隔时间
        dayMaxEventRows: 6, // 月视图中达到多少个出现更多
        events: [], // alternatively, use the `events` setting to fetch from a feed
        navLinks: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        datesSet: this.cellClick, // 切换工具栏触发
        select: this.handleDateSelect, // 点击空白单元格，添加任务时触发
        eventClick: this.handleEventClick, // 点击工作标签后触发
        eventsSet: this.handleEvents,
        eventContent: this.contentEvent, // 自定义返回的工作标签样式
        eventOverlap: false,
        eventDrop: this.eventDropt, // 拖拽后触发
        eventResize: this.eventDropt
        /* you can update a remote database when these fire:
            eventAdd:
            eventChange:
            eventRemove:
            */
      },
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
    this.search()
  },
  methods: {
    getHeight() {
      const height = window.innerHeight * 0.85
      return height
    },
    setEvents(data) {
      const that = this
      if (this.isColor) {
        data.forEach(function(a, b) {
          const time = new Date().getTime()
          let color = that.START_COLOR
          if (time < new Date(a.start).getTime()) {

          } else if (time > new Date(a.end).getTime()) {
            color = that.END_COLOR
          } else {
            color = that.LOADING_COLOR
          }
          a.color = color
        })
      }
      this.calendarOptions.events = data
    },
    cancel() {
      this.dialogFormVisible = false
      this.restTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    formatDate(date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      var h = date.getHours()
      var minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute
    },
    contentEvent(arg) {

    },
    updateData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          update(that.temp).then(res => {
            if (res.success) {
              const title = that.temp.scheduleName
              that.selectInfo.event.setProp('title', title)
              that.selectInfo.event.setDates(that.temp.scheduleStartTime, that.temp.scheduleEndTime)
              that.selectInfo.event.setExtendedProp('extendedProp', that.temp)
              // const calendarApi = that.selectInfo.view.calendar
              // calendarApi.refetchEvents()
              that.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '更新失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
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
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    cellClick(events) {
      if (events.view.type === 'dayGridMonth') {
        this.calendarOptions.buttonText.prev = '上一月'
        this.calendarOptions.buttonText.next = '下一月'
      } else if (events.view.type === 'timeGridWeek') {
        this.calendarOptions.buttonText.prev = '上一周'
        this.calendarOptions.buttonText.next = '下一周'
      } else if (events.view.type === 'timeGridDay') {
        this.calendarOptions.buttonText.prev = '上一天'
        this.calendarOptions.buttonText.next = '下一天'
      }
    },
    handleEvents(events) {
      this.currentEvents = events
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
  .fc .fc-timegrid-slot-minor {
    border-top-style: hidden;
  }

  .fc .fc-timegrid-slot {
    height: 7em !important;
    border-bottom: 0 /* each cell owns its top border */;
  }

  .fc-daygrid-event {
    white-space: normal !important;
  }
</style>
