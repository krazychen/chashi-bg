<template>
  <div>
    <full-calendar
      ref="calendar"
      :handle-date-select="handleDateSelect"
      :import-date-select="importDateSelect"
      :create-data="createData"
      :search="search"
      :event-dropt="eventDropt"
      :delete-data="deleteData"
      :handle-event-click="handleEventClick"
      :is-color="isColor"
      :header-toolbar="headerToolbar"
      :event-start-editable="true"
      :event-duration-editable="true"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="355px" @closed="closeAfter">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="90px"
        style="width: 315px;"
      >
        <el-form-item label="名称" prop="scheduleName">
          <el-input
            v-model="temp.scheduleName"
            placeholder="请输入名称"
            :style="selectwidthz"
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
          />
        </el-form-item>
        <el-form-item label="班级标签" prop="scheduleClassTypes">
          <el-select
            v-model="temp.scheduleClassTypes"
            placeholder="请选择班级标签"
            clearable
            collapse-tags
            :multiple="true"
            class="filter-item"
            :style="selectwidthz"
            @change="classChange"
          >
            <el-option v-for="item in typeIds" :key="item.id" :label="item.typeName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input
            v-model="temp.remarks"
            type="textarea"
            maxlength="200"
            :show-word-limit="true"
            placeholder="请输入备注信息"
            :style="selectwidthz"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-popconfirm v-if="dialogStatus==='update'" class="del" title="确认删除？" @confirm="deleteData()">
          <el-button slot="reference" type="danger">
            删除
          </el-button>
        </el-popconfirm>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入文件" :visible.sync="excelImportShow" width="560px">
      <a href="javascript:;" class="file">
        <input
          id="upload"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="importFileTeacher(this)"
        >
      </a>
      <button id="submitRelease" class="btn sbold green" @click="downloadTemplate">
        <span class="ladda-label">下载模板</span>
      </button>
      <br>
      <span style="color: red;position:relative; top: 25px;">提示：仅允许导入.xls和.xlsx的格式文件</span>
      <div id="demo" />
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="excelImportShow = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click.native="submitUpload()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FullCalendar from '@/components/Schedule'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'
import { addHwClassSchedule, getScheduleInfo, update, deleteSchedule, importSchedule } from '@/api/system/schedule.js'

export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  data: function() {
    return {
      headerToolbar: {
        left: 'prev,next today myCustomButton importButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      excelImportShow: false,
      addLoading: false,
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
        scheduleClassTypes: [{ required: true, message: '请选择班级标签', trigger: 'blur' }],
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
    importFileTeacher(file) {
      this.file = event.currentTarget.files[0]
      this.files = this.file
      if (this.file.name.indexOf('.xls') === -1 && this.file.name.indexOf('.xlsx') === -1) {
        this.$message.warning('上传文档只能是 xls、xlsx格式!')
        return false
      }
    },
    submitUpload() {
      if (this.file === '') {
        this.$message.warning('请选择要导入的文件！')
        return false
      }
      this.addLoading = true
      const fileFormData = new FormData()
      fileFormData.append('file', this.files)// filename是键，file是值，就是要传的文件，test.zip是要传的文件名
      importSchedule(fileFormData).then(response => {
        this.addLoading = false
        this.excelImportShow = false
        if (response.data) {
          this.$message({
            message: '导入成功',
            type: 'success'
          })
          this.search()// 重新请求一次页面数据
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    downloadTemplate() {
      window.location.href = '/hwClassSchedule/downloadTemplate/'
    },
    cancel() {
      this.dialogFormVisible = false
      this.restTemp()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    deleteData() {
      const that = this
      deleteSchedule(that.temp.id).then(res => {
        if (res.success) {
          that.selectInfo.event.remove()
          that.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '删除失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    search() {
      const that = this
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
    eventDropt(selectInfo) {
      const that = this
      this.temp = JSON.parse(JSON.stringify(selectInfo.event._def.extendedProps.extendedProp))
      this.temp.scheduleStartTime = that.formatDate(selectInfo.event.start)
      this.temp.scheduleEndTime = that.formatDate(selectInfo.event.end)
      update(that.temp).then(res => {
        if (res.success) {
          selectInfo.event.setExtendedProp('extendedProp', that.temp)
          this.restTemp()
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
      console.log(this.temp)
    },
    contentEvent(arg) {

    },
    createData() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 确认后把数据请求到后台
          addHwClassSchedule(that.temp).then(res => {
            if (res.success && res.data != null && res.data) {
              that.temp.id = res.data.id
              // 添加课程
              /*              const calendarApi = that.selectInfo.view.calendar
                calendarApi.unselect() // clear date selection
                const title = that.temp.scheduleName
                calendarApi.addEvent({
                  id: that.temp.id,
                  title,
                  start: that.temp.scheduleStartTime,
                  end: that.temp.scheduleEndTime,
                  extendedProps: { 'extendedProp': that.temp }
                })*/
              that.search()
              that.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
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
    handleDateSelect(selectInfo) {
      // 新建
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.selectInfo = selectInfo
      this.temp.scheduleStartTime = this.formatDate(selectInfo.start)
      this.temp.scheduleEndTime = this.formatDate(selectInfo.end)
    },
    importDateSelect(selectInfo) {
      this.excelImportShow = true
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
    handleEvents(events) {
      this.currentEvents = events
    }
  }
}
</script>

<style lang='css'>

  .del {
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
