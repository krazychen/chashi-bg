<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.jobName" placeholder="任务名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.jobGroup" placeholder="任务分组" clearable style="width: 200px;" class="filter-item">
        <el-option v-for="item in jobGroupCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="任务状态" clearable style="width: 200px;" class="filter-item">
        <el-option v-for="item in statusCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-remove" @click="batchStop">
        停止
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-success" @click="batchRecovery">
        恢复
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55px"
      />
      <el-table-column align="center" label="任务名称" width="150" fixed>
        <template slot-scope="scope">
          {{ scope.row.jobName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务分组" width="100" fixed prop="jobGroup" :formatter="jobGroupFormat" />
      <el-table-column align="center" label="任务类型" width="100" fixed>
        <template slot-scope="scope">
          {{ scope.row.jobType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="bean名称" width="150" fixed>
        <template slot-scope="scope">
          {{ scope.row.beanName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="参数" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.params && scope.row.params.length>100?scope.row.params.substring(0,100):scope.row.params }}</span>
          <i v-if="scope.row.params && scope.row.params.length>100" title="更多" class="el-icon-more" style="color: #72cdfd" @click="more(scope.row.params)" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="调度周期" width="230">
        <template slot-scope="scope">
          <span v-if="scope.row.jobType == 'simple'">
            间隔{{ scope.row.simpleTime }}{{ scope.row.simpleUnit }},重复{{ scope.row.simpleRepeatCount }}次
          </span>
          <span v-if="scope.row.jobType == 'cron'">
            {{ scope.row.cronExpression }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="任务开始时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime?scope.row.startTime:'-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="任务结束时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime?scope.row.endTime:'-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="任务备注" width="320">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="任务状态" width="80" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #315FC2;margin-left:15px;" type="primary" @click="lookDispatch(scope.row)" />
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
          <span v-if="scope.row.status == 0">
            <i class="el-icon-remove" title="停止" tooltip="true" style="color: #acdef5;margin-left:15px;" type="primary" @click="pauseTask(scope.row)" />
          </span>
          <span v-if="scope.row.status == 1">
            <i class="el-icon-success" title="恢复" tooltip="true" style="color: #15f5d1;margin-left:15px;" type="primary" @click="resumeTask(scope.row)" />
          </span>
          <i class="el-icon-view" title="调度日志" tooltip="true" style="color: #86f5a3;margin-left:15px;" type="primary" @click="lookDispatchLog(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog title="参数" :visible.sync="dialogParamVisible" width="600px">
      <div style="height: 580px;overflow-y: auto">
        <p>{{ param }}</p>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="temp.jobName" placeholder="请输入任务名称" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="任务分组" prop="jobGroup">
          <el-select v-model="temp.jobGroup" placeholder="请选择任务分组" style="width: 280px" :disabled="chakan">
            <el-option v-for="item in jobGroupCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" :disabled="chakan" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型" prop="jobType">
          <el-radio v-model="temp.jobType" label="simple" :disabled="chakan">simple</el-radio>
          <el-radio v-model="temp.jobType" label="cron" :disabled="chakan">cron</el-radio>
        </el-form-item>
        <el-form-item v-if="temp.jobType == 'simple'" label="重复次数" prop="simpleRepeatCount">
          <el-input v-model="temp.simpleRepeatCount" placeholder="请输入重复次数" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :disabled="chakan" />
        </el-form-item>
        <el-form-item v-if="temp.jobType == 'simple'" label="间隔单位" prop="simpleUnit">
          <el-select v-model="temp.simpleUnit" placeholder="请选择间隔单位" style="width: 280px" :disabled="chakan">
            <el-option v-for="item in simpleUnitCodes" :key="item.value" :label="item.label" :value="item.value" :disabled="chakan" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.jobType == 'simple'" label="间隔时间" prop="simpleTime">
          <el-input v-model="temp.simpleTime" placeholder="请输入间隔时间" onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" :disabled="chakan" />
        </el-form-item>
        <el-form-item v-if="temp.jobType == 'cron'" label="周期表达式" prop="cronExpression">
          <el-input v-model="temp.cronExpression" placeholder="请输入周期表达式" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="调用bean名称" prop="beanName">
          <el-input v-model="temp.beanName" placeholder="请输入调用bean名称" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="参数" prop="params">
          <el-input v-model="temp.params" placeholder="请输入参数" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="任务开始时间" prop="startTime">
          <el-date-picker v-model="temp.startTime" type="datetime" style="width: 280px" placeholder="选择开始日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="任务结束时间" prop="endTime">
          <el-date-picker v-model="temp.endTime" type="datetime" style="width: 280px" placeholder="选择结束日期" value-format=" yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" :disabled="chakan" />
        </el-form-item>
        <el-form-item label="任务备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="请输入任务备注" type="textarea" :rows="3" :disabled="chakan" />
        </el-form-item>
      </el-form>
      <div v-if="!chakan" slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="调度日志" :visible.sync="dialogFormVisible1" center :before-close="closeLogList">
      <div class="filter-container">
        <el-date-picker v-model="taskLogListQuery.startTime" class="filter-item" style="width: 200px;" type="datetime" placeholder="日志开始时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        <el-date-picker v-model="taskLogListQuery.endTime" class="filter-item" style="width: 200px;" type="datetime" placeholder="日志结束时间" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="logHandleFilter">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest1">
          重置
        </el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="taskLogList"
        style="width: 100%"
      >
        <el-table-column align="center" label="任务名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.jobName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="调用bean名称" width="150">
          <template slot-scope="scope">
            {{ scope.row.beanName }}
          </template>
        </el-table-column>
        <el-table-column label="参数" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.params && scope.row.params.length>100?scope.row.params.substring(0,100):scope.row.params }}</span>
            <i v-if="scope.row.params && scope.row.params.length>100" title="更多" class="el-icon-more" style="color: #72cdfd" @click="more(scope.row.params)" />
          </template>
        </el-table-column>
        <el-table-column label="失败信息" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.error }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行耗时" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.times }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任务发生时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="taskLogTotal>0" :total="taskLogTotal" :page.sync="taskLogListQuery.current" :limit.sync="taskLogListQuery.size" @pagination="getTaskLogList" />
    </el-dialog>
  </div>
</template>

<script>
import { getTaskList, createTask, updateTask, deleteTask, pauseTask, resumeTask, batchStopTask, batchRecoveryTask, findTaskLogList } from '@/api/system/taskMonitoring'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'TaskMonitoring',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      chakan: false,
      list: null,
      taskLogList: null,
      listLoading: true,
      taskLogListLoading: true,
      taskLogTotal: 0,
      total: 0,
      multipleSelection: [],
      sysJobFreq: [],
      jobGroupCodes: [],
      statusCodes: [],
      listQuery: {
        current: 1,
        jobName: '',
        jobGroup: '',
        status: ''
      },
      taskLogListQuery: {
        current: 1,
        jobId: '',
        startTime: '',
        endTime: ''
      },
      temp: {
        id: undefined,
        jobName: '',
        jobGroup: '',
        jobType: '',
        beanName: '',
        params: '',
        cronExpression: '', // 表达式
        simpleTime: '', // 间隔时间
        simpleUnit: '', // 间隔单位
        simpleRepeatCount: '', // 重复次数
        startTime: '',
        endTime: '',
        status: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogParamVisible: false,
      param: '',
      dialogFormVisible1: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      simpleUnitCodes: [{
        value: 'milliseconds',
        label: '毫秒'
      }, {
        value: 'seconds',
        label: '秒'
      }, {
        value: 'minutes',
        label: '分钟'
      }, {
        value: 'hours',
        label: '小时'
      }, {
        value: 'days',
        label: '天'
      }],
      rules: {
        jobName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        jobGroup: [{ required: true, message: '请选择任务分组', trigger: 'blur' }],
        jobType: [{ required: true, message: '请选择任务类型', trigger: 'change' }]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.jobGroupCodes = getDictDataList('sys_job_group')
    this.statusCodes = getDictDataList('sys_job_status')
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTaskList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    logHandleFilter() {
      this.taskLogListQuery.page = 1
      this.taskLogListLoading = true
      this.getTaskLogList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        jobName: '',
        jobGroup: '',
        jobType: '',
        beanName: '',
        params: '',
        simpleRepeatCount: '', // 重复次数
        simpleUnit: '', // 间隔单位
        simpleTime: '', // 间隔时间
        cronExpression: '', // 周期表达式
        startTime: '',
        endTime: '',
        status: 0, // 默认已激活
        remarks: ''
      }
    },
    handleCreate() {
      this.chakan = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTask(this.temp).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      if (row.status === 0) {
        this.$message({
          message: '任务已激活,不能修改!',
          type: 'warning'
        })
        return false
      }
      this.chakan = false
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateTask(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      if (row.status === 0) {
        this.$message({
          message: '任务已激活,不能删除!',
          type: 'warning'
        })
        return false
      }
      this.temp = Object.assign({}, row) // copy obj
      deleteTask(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() { // 重置功能
      this.listQuery.jobName = ''
      this.listQuery.jobGroup = ''
      this.listQuery.status = ''
      this.fetchData()
    },
    rest1() { // 任务日志重置
      this.taskLogListQuery.startTime = ''
      this.taskLogListQuery.endTime = ''
      this.taskLogListLoading = true
      this.getTaskLogList()
    },
    lookDispatchLog(row) { // 查看调度日志
      this.taskLogListQuery.jobId = row.id
      this.getTaskLogList()
      this.dialogFormVisible1 = true
      this.taskLogListLoading = true
    },
    getTaskLogList() { // 调度日志列表查询
      findTaskLogList(this.taskLogListQuery).then(response => {
        console.log(response.data)
        this.taskLogList = response.data.records
        this.taskLogTotal = parseInt(response.data.total)
        this.taskLogListLoading = false
      })
    },
    pauseTask(row) { // 暂停任务
      this.temp = Object.assign({}, row) // copy obj
      pauseTask(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '暂停任务成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    resumeTask(row) { // 恢复任务
      this.temp = Object.assign({}, row) // copy obj
      resumeTask(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '恢复任务成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchStop() { // 批量停止
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据!',
          type: 'warning'
        })
        return false
      }
      let taskId = ''
      for (let i = 0; i < length; i++) {
        taskId += this.multipleSelection[i].id + ','
      }
      batchStopTask(taskId).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量停止任务成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    batchRecovery() { // 批量恢复
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据!',
          type: 'warning'
        })
        return false
      }
      let taskId = ''
      for (let i = 0; i < length; i++) {
        taskId += this.multipleSelection[i].id + ','
      }
      batchRecoveryTask(taskId).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量恢复任务成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    lookDispatch(row) { // 查看
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.chakan = true
    },
    closeLogList() { // 关闭调度日志
      this.taskLogListQuery.startTime = ''
      this.taskLogListQuery.endTime = ''
      this.dialogFormVisible1 = false
    },
    more(params) {
      this.param = ''
      this.dialogParamVisible = true
      this.param = params
    },
    jobGroupFormat(row) {
      let vv = '-'
      const typ = this.jobGroupCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.jobGroup) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    statusFormat(row) {
      let vv = '-'
      const typ = this.statusCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.status.toString()) {
          vv = aa.dictLabel
        }
      })
      return vv
    }
  }
}
</script>
