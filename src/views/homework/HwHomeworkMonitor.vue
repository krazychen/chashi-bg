<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建监控
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
    >
      <el-table-column label="监控名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.monitorName }}
        </template>
      </el-table-column>
      <el-table-column
        label="监控类型"
        align="center"
      >
        <template slot-scope="scope" align="center">
          {{ scope.row.monitorType==='1'?'批改情况监控':'-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="monitorSubjectTypeName"
        label="监控题型"
        align="center"
      />
      <el-table-column
        label="上次刷新时间"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.monitorExeTime?scope.row.monitorExeTime:'-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="监控状态"
        :formatter="menuTypeFormat"
        align="center"
      >
        <template slot-scope="scope" align="center">
          {{ scope.row.status===0?'停用':scope.row.status===1?'启用':'-' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="small-padding fixed-width" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i v-if="scope.row.status===0 || scope.row.status===1" title="删除" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" @click="delConfirm(scope.row.id)" />
          <i v-if="scope.row.status===1" title="停用" class="fa fa-ban" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row.id,0)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row.id,1)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px" class="addClass" @closed="addClosed">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 450px; margin-left:50px;">
        <el-form-item label="监控名称" prop="monitorName">
          <el-input v-model="temp.monitorName" :maxlength="20" show-word-limit placeholder="请输入监控名称" />
        </el-form-item>
        <el-form-item label="监控类型" prop="monitorType">
          <el-select v-model="temp.monitorType" placeholder="请选择监控类型" style="width: 80%">
            <el-option v-for="item in monitorTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" class="filter-item" />
          </el-select>
        </el-form-item>
        <el-form-item label="监控班级" prop="classTypeAndClass">
          <el-button size="small" type="primary" plain @click="classChoiceSetting()">选择班级+
          </el-button>
          <div
            v-if="temp.classTypeAndClass && temp.classTypeAndClass.length>0"
            style="width: 340px;height:210px;border:1px solid #DCDFE6;padding: 10px 20px;margin-top: 10px;color: #606266;overflow: auto;"
          >
            <el-row>
              <el-col :span="12">标签</el-col>
              <el-col :span="12">班级名称</el-col>
            </el-row>
            <el-row v-for="item in temp.classTypeAndClass">
              <el-col :span="12">{{ item.typeName }}</el-col>
              <el-col :span="12"><span v-for="(ite,index) in item.classList">{{ item.classList && item.classList.length==index+1?ite.className:(ite.className+ '，') }}</span>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="监控题型" prop="monitorSubjectTypeId">
          <el-radio-group v-model="temp.monitorSubjectTypeId" @change="setSubject">
            <el-radio v-for="item in monitorSubjectTypeIds" :key="item.id" :label="item.id" :value="item.id">{{ item.typeName }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始监控时间" prop="monitorStartTime">
          <el-date-picker v-model="temp.monitorStartTime" style="width: 80%" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" />
        </el-form-item>
        <el-form-item label="监控频率" prop="monitorFrequency">
          <el-row :gutter="10">
            <el-col :span="2">
              每
            </el-col>
            <el-col :span="4">
              <el-input v-model="temp.monitorFrequency" />
            </el-col>
            <el-col :span="6">
              小时
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="webhook链接" prop="monitorWebhook">
          <el-input v-model="temp.monitorWebhook" type="textarea" show-word-limit placeholder="请输入webhook链接" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <classTypeAndClass
      :father-class-choice.sync="classChoice"
      :page-list-by-class-type="getPageListByClassTypes"
      :class-type-and-class="getClassAndClassType"
      :get-hw-homework-class-ref="getHwHomeworkClassRefList"
      @classListsss="classLists"
    />
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="tableDeleteRow()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getClassAndClassTypeList, getPageListByClassType } from '@/api/homework/hwClassType'
import { addHwHomeworkMonitor, getHwHomeworkMonitorPageList, resumeJob, pauseJob, deleteHwHomeworkMonitor, getHwHomeworkMonitorList } from '@/api/homework/hwHomeworkMonitor'
import classTypeAndClass from '@/views/homework/newClassTypeAndClass.vue'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { dialogFormRules } from '@/utils/validate.js'
import UserNav from '../../components/UserNav'
export default {
  name: 'HwHomeworkMonitor',
  components: { Pagination, classTypeAndClass },
  directives: { waves },
  data() {
    return {
      listHwHomeworkClassRef: [],
      classChoice: false,
      listLoading: false,
      total: 0,
      listQuery: {
        current: 1
      },
      monitorTypes: [{ dictLabel: '批改情况监控', dictValue: '1' }],
      monitorSubjectTypeIds: [],
      temp: {
        classTypeAndClass: [],
        monitorName: undefined,
        monitorType: undefined,
        monitorSubjectTypeId: undefined,
        monitorStartTime: undefined,
        monitorFrequency: undefined,
        monitorClassIds: undefined,
        monitorWebhook: undefined
      },
      list: [],
      dialogStatus: '',
      delVisible: false,
      delId: undefined,
      dialogFormVisible: false,
      textMap: {
        update: '编辑监控',
        create: '新建监控'
      },
      rules: {
        monitorName: [{ required: true, message: '请输入监控名称', trigger: 'blur' }],
        monitorType: [{ required: true, message: '请选择监控类型', trigger: 'blur' }],
        subject: [{ required: true, message: '请选择监控题型', trigger: 'blur' }],
        monitorStartTime: [{ required: true, message: '请输入开始监控时间', trigger: 'blur' }],
        monitorFrequency: [{ required: true, message: '请输入监控频率', trigger: 'change' }, { validator: dialogFormRules }, { validator: this.validatorFrequency }],
        monitorWebhook: [{ required: true, message: '请输入webhook链接', trigger: 'change' }],
        classTypeAndClass: [{ required: true, message: '请选择监控班级', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    validatorFrequency(rule, value, callback) {
      if (value && value > 24) {
        callback(new Error('频率数最高设置为24'))
      } else {
        callback()
      }
    },
    delConfirm(id) {
      this.delId = id
      this.delVisible = true
    },
    tableDeleteRow() {
      deleteHwHomeworkMonitor(this.delId).then(res => {
        if (res.success && res.data != null && res.data) {
          this.fetchData()
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
        this.delVisible = false
      })
    },
    updateStatus(id, state) {
      if (state === 0) {
        pauseJob(id).then(res => {
          if (res.success && res.data != null && res.data) {
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '暂停成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '暂停失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      }
      if (state === 1) {
        resumeJob(id).then(res => {
          if (res.success && res.data != null && res.data) {
            this.fetchData()
            this.$notify({
              title: '成功',
              message: '启用成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '启用失败',
              type: 'error',
              duration: 2000
            })
          }
        })
      }
    },
    setSubject(id) {
      const val = this.monitorSubjectTypeIds.find(item => item.id === id)
      this.temp.monitorSubjectTypeName = val.typeName
    },
    classLists(val) {
      const that = this
      that.listHwHomeworkClassRef = []
      this.temp.classTypeAndClass = val
      val.forEach(function(a, b) {
        a.classList.forEach(function(c, d) {
          const hwHomeworkClassRef = {}
          hwHomeworkClassRef['classTypeId'] = a.id
          hwHomeworkClassRef['classTypeName'] = a.typeName
          hwHomeworkClassRef['classId'] = c.id
          hwHomeworkClassRef['className'] = c.className
          that.listHwHomeworkClassRef.push(hwHomeworkClassRef)
        })
      })
    },
    async getPageListByClassTypes(data) {
      const ddd = await getPageListByClassType(data)
      return ddd
    },
    async getClassAndClassType() {
      const ddd = await getClassAndClassTypeList({})
      this.monitorSubjectTypeIds = ddd.data.allhwSubjectType
      return ddd.data.allClassAndClass
    },
    async getHwHomeworkClassRefList() {
      if (this.listHwHomeworkClassRef && this.listHwHomeworkClassRef.length > 0) {
        return this.listHwHomeworkClassRef
      } else {
        return []
      }
    },
    classChoiceSetting() {
      this.classChoice = true
    },
    addClosed() {
      this.resetTemp()
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.setClassAndClassTypeData()
          const tempData = Object.assign({}, this.temp)
          /*          updateUser(tempData).then(() => {
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
          })*/
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.setClassAndClassTypeData()
          addHwHomeworkMonitor(this.temp).then(() => {
            // this.list.unshift(this.temp)
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
    setClassAndClassTypeData() {
      const that = this
      this.temp.monitorClassIds = ''
      const classIds = new Set()
      this.listHwHomeworkClassRef.forEach(function(a, b) {
        classIds.add(a.classId)
      })
      if (classIds.size > 0) {
        classIds.forEach(function(c, d) {
          that.temp.monitorClassIds = that.temp.monitorClassIds + c + ','
        })
      }
      if (this.temp.monitorClassIds.length > 0) {
        this.temp.monitorClassIds = this.temp.monitorClassIds.substring(0, this.temp.monitorClassIds.lastIndexOf(','))
      }
    },
    fetchData() {
      this.listLoading = true
      getHwHomeworkMonitorPageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp() {
      this.temp = {
        classTypeAndClass: [],
        monitorName: undefined,
        monitorType: undefined,
        monitorSubjectTypeId: undefined,
        monitorStartTime: undefined,
        monitorFrequency: undefined,
        monitorClassIds: undefined,
        monitorWebhook: undefined
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      getHwHomeworkMonitorList(row.id).then(res => {
        if (res.success) {
          this.temp = Object.assign({}, row) // copy obj
          this.temp.classTypeAndClass = res.data
          res.data.forEach(function(a) {
            a.classList = a.listClass
          })
          this.classLists(res.data)
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        }
      })
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const typ = this[type.property + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === (row[type.property] + '')) {
          vv = aa.dictLabel
        }
      })
      return vv
    }
  }
}
</script>

<style scoped>
/deep/ .addClass .el-dialog__body{
  max-height: 760px;
  overflow-y: auto;
}
</style>
