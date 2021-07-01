<template>
  <div class="app-container">
    <div class="app-container1">
      <el-form ref="dataForm" :rules="rules" :model="temp.hwHomeworkGroup" label-position="left" label-width="140px">
        <el-form-item label="作业组名称" prop="groupName">
          <el-input v-model="temp.hwHomeworkGroup.groupName" placeholder="请输入作业组名称" :disabled="chakan" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="最大作业数量" prop="groupMaxNum">
          <el-input v-model="temp.hwHomeworkGroup.groupMaxNum" placeholder="请输入最大作业数量" :disabled="chakan" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="最大允许提交数量" prop="groupAllowMaxNum">
          <el-input v-model="temp.hwHomeworkGroup.groupAllowMaxNum" placeholder="请输入最大允许提交数量" :disabled="chakan" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="作业开始时间">
          <el-date-picker
            v-model="temp.hwHomeworkGroup.groupStartTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="作业提交截止时间" prop="groupEndTime">
          <el-date-picker
            v-model="temp.hwHomeworkGroup.groupEndTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="老师批改截止时间" prop="groupAuditEndTime">
          <el-date-picker
            v-model="temp.hwHomeworkGroup.groupAuditEndTime"
            :picker-options="start_Date"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="学生追问截止时间" prop="groupQaEndTime">
          <el-date-picker
            v-model="temp.hwHomeworkGroup.groupQaEndTime"
            :picker-options="start_DateEndTime"
            type="datetime"
            placeholder="选择日期"
            :style="selectwidthz"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            :disabled="chakan"
          />
        </el-form-item>
        <el-form-item label="发布班级" prop="classTypeId">
          <el-button v-show="!chakan" size="small" type="primary" plain :disabled="chakan" @click="classChoiceSetting()">选择班级+
          </el-button>
          <div
            v-if="classTypeAndClass.length>0"
            style="width: 500px;height:210px;border:1px solid #DCDFE6;padding: 10px 20px;margin-top: 10px;color: #606266;overflow: auto;"
          >
            <el-row>
              <el-col :span="12">标签</el-col>
              <el-col :span="12">班级名称</el-col>
            </el-row>
            <el-row v-for="item in classTypeAndClass">
              <el-col :span="12">{{ item.typeName }}</el-col>
              <el-col :span="12"><span v-for="(ite,index) in item.classList">{{ item.classList.length==index+1?ite.className:(ite.className+ '，') }}</span>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <h2>作业信息</h2>
        <el-divider style="margin-top: 0px" />
      </el-form>
      <div class="filter-container">
        <el-button v-show="!chakan" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
        <el-button v-show="!chakan" v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="batchDelete">
          删除
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="temp.homeworkList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :row-class-name="tableRowClassName"
        @selection-change="selectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column align="center" fixed label="题目名称">
          <template slot-scope="scope">
            {{ scope.row.hwHomework.subjectName }}
          </template>
        </el-table-column>
        <el-table-column label="作业开始时间" width="200" align="center" fixed>
          <template slot-scope="scope">
            {{ scope.row.hwHomework.startTime }}
          </template>
        </el-table-column>
        <el-table-column label="作业提交截止时间" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hwHomework.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="老师批改截止时间" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hwHomework.auditEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生追问截止时间" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.hwHomework.qaEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hwHomework.subScoreCount"
          label="子分数个数"
          width="200"
        />
        <el-table-column
          label="班级标签"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.hwHomework.classTypeName" placement="top">
              <span>
                <div v-if="scope.row.hwHomework.classTypeName" class="extra">
                  {{ scope.row.hwHomework.classTypeName }}
                </div>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="班级"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.hwHomework.className" placement="top">
              <span>
                <div v-if="scope.row.hwHomework.className" class="extra">
                  {{ scope.row.hwHomework.className }}
                </div>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="hwHomework.subjectTypeName"
          label="题目类型"
          width="200"
        />
        <el-table-column
          prop="hwHomework.subjectState"
          label="题目状态"
          width="200"
          :formatter="menuTypeFormat"
        />
        <el-table-column
          prop="学员数"
          label="学员数"
          width="200"
          :formatter="xueyuan"
        />
        <el-table-column
          label="当前批改老师"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.hwHomework.teacherNames" placement="top">
              <span>
                <div v-if="scope.row.hwHomework.teacherNames" class="extra">
                  {{ scope.row.hwHomework.teacherNames }}
                </div>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="hwHomework.fhteacherNames"
          label="当前复核老师"
          width="200"
        />
        <el-table-column
          prop="hwHomework.completeExplain"
          label="作业说明"
          width="200"
        >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.hwHomework.completeExplain" placement="top">
              <span>
                <div v-if="scope.row.hwHomework.completeExplain" class="extra">
                  {{ scope.row.hwHomework.completeExplain }}
                </div>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="hwHomework.isQa"
          label="启用追问"
          width="200"
          :formatter="menuTypeFormat"
        />
        <el-table-column
          prop="hwHomework.qaNumbers"
          label="追问人数"
        />
        <el-table-column
          prop="hwHomework.username"
          label="发布人"
        />
        <el-table-column
          prop="hwHomework.subjectTime"
          label="发布时间"
          width="200"
        />
        <el-table-column label="操作" align="center" width="100" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <i :class="chakan?'el-icon-camera':'el-icon-edit'" style="color: #67C23A;margin-left:10px;" :title="chakan?'查看':'编辑'" @click="handleUpdate(scope.row,scope.$index)" />
            <i v-if="!chakan" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="singlehandleDelete(scope.row,scope.$index)" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
    </div>
    <classTypeAndClass
      :father-class-choice.sync="classChoice"
      :page-list-by-class-type="getPageListByClassTypes"
      :class-type-and-class="getClassAndClassType"
      :get-hw-homework-class-ref="getHwHomeworkClassRefList"
      @classListsss="classLists"
    />
    <el-dialog :title="textMap[dialogStatusnei]" :visible.sync="addVisible" width="1280px" @opened="initialization()" @closed="eliminate">
      <addHwHomework ref="mychild" :quote="true" @transmissionDate="transmissionDate" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">
          取消
        </el-button>
        <el-button v-show="!chakan" type="primary" @click="dialogStatusnei==='create'?createData('0'):updateData('0')">
          确定
        </el-button>
      </div>
    </el-dialog>
    <div v-if="!chakan" style="float: right;margin-right: 100px;margin-top: 100px;">
      <el-button
        type="primary"
        icon="el-icon-check"
        @click="dialogStatus==='create'?save('0'):update('0')"
      >
        保存
      </el-button>
      <el-button icon="el-icon-check" type="primary" @click="dialogStatus==='create'?save('1'):update('1')">
        发布
      </el-button>
    </div>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">是否删除作业（{{ subjectName }}），请确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, createUser, updateUser, deleteUser } from '@/api/system/user'
import Pagination from '@/components/Pagination'
import { dialogFormRules } from '@/utils/validate'
import waves from '@/directive/waves' // waves directive
import { gethwHomeworkList } from '@/api/homework/hwHomework'
import addHwHomework from '@/views/homework/addHwHomework'
import {
  saveHwHomeworkGroup,
  updateHwHomeworkGroups
} from '@/api/homework/hwHomeworkGroup'
import {
  deletehwHomework,
  deletehwHomeworks
} from '@/api/homework/hwHomework'
import {
  getClassAndClassTypeList,
  getPageListByClassType,
  getGroupHwHomeworkClassRefListByHomeworkId
} from '@/api/homework/hwClassType'
import classTypeAndClass from '@/views/homework/classTypeAndClass'
import { getDictDataList } from '@/utils/dictUtils'
// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UserMgn',
  components: { Pagination, classTypeAndClass, addHwHomework },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return stateMap[state]
    }
  },
  data() {
    return {
      subjectStates: [],
      isQas: [],
      classTypeIds: [],
      classTypeIdss: {},
      classsxz: [],
      classs: [],
      rowIndex: undefined,
      deleteor: 'delete',
      delVisible: false,
      subjectName: undefined,
      currentRow: undefined,
      currentIndex: undefined,
      start_Date: {
        disabledDate: time => {
          return time.getTime() + (1000 * 60 * 60 * 24) <= new Date(this.temp.hwHomeworkGroup.groupEndTime).getTime()
        }
      },
      start_DateEndTime: {
        disabledDate: time => {
          return time.getTime() + (1000 * 60 * 60 * 24) <= new Date(this.temp.hwHomeworkGroup.groupAuditEndTime).getTime()
        }
      },
      addVisible: false,
      multipleSelection: [],
      listHwHomeworkClassRef: [],
      chakan: false,
      classTypeAndClass: [],
      classChoice: false,
      list: [],
      listLoading: false,
      total: 0,
      listQuery: {
        current: 1,
        typeName: undefined,
        status: undefined,
        remarks: undefined
      },
      temp: {
        hwHomeworkGroup: {
          id: undefined,
          groupStartTime: undefined,
          groupEndTime: undefined,
          groupAuditEndTime: undefined,
          groupQaEndTime: undefined,
          groupName: undefined, // 暂时写死
          groupMaxNum: undefined, // 暂时写死
          groupAllowMaxNum: undefined,
          groupSubjectState: 0
        },
        homeworkList: []
      },
      dialogFormVisible: false,
      dialogStatus: 'create',
      dialogStatusnei: 'create',
      usernameDisabled: false,
      textMap: {
        update: '新增作业',
        create: '编辑作业'
      },
      stateOptions: [{
        value: 0,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }, {
        value: 2,
        label: '锁定'
      }],
      rules: {
        groupName: [{ required: true, message: '请输入题目名称', trigger: 'blur' }],
        groupEndTime: [{ required: true, message: '请选择作业提交截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateAuditEndTime
        }],
        groupAuditEndTime: [{ required: true, message: '请选择作业批改截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateQaEndTime
        }],
        groupQaEndTime: [{ required: true, message: '请选择追问截止时间', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.updateQaEnd
        }],
        groupMaxNum: [{ required: true, message: '请输入最大作业数量', trigger: 'blur' }, {
          validator: dialogFormRules,
          trigger: 'blur'
        }],
        groupAllowMaxNum: [{ required: true, message: '请输最大允许提交数量', trigger: 'blur' }, {
          validator: this.groupAllowMaxNum,
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.subjectStates = getDictDataList('hw_homework_status')
    this.isQas = getDictDataList('sys_yes_no')
    const row = this.$route.query.row
    if (row === undefined) {

    } else {
      const pd = this.$route.query.pd
      this.initializationGroup(row, pd)
    }
  },
  methods: {
    xueyuan(row) {
      return row.hwHomework.stu + '/' + row.hwHomework.ytj + '/' + row.hwHomework.ypg + '/' + row.hwHomework.yfp
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const name = type.property.replace('hwHomework.', '')
      const typ = this[name + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === (row.hwHomework[name] + '')) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    initializationGroup(row, pd) {
      if (pd === 'info') {
        this.chakan = true
      } else {
        this.chakan = false
        this.dialogStatus = 'update'
      }
      this.fetchData(row)
    },
    load(text, lock) {
      const loading = this.$loading({
        lock: true,
        text: text,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    tableRowClassName(row) {
      row.row.index = row.rowIndex
    },
    singlehandleDelete(row, index) {
      this.delVisible = true
      this.deleteor = 'delete'
      this.row = row
      this.rowIndex = index
      this.subjectName = row.hwHomework.subjectName
    },
    groupAllowMaxNum(rule, value, callback) {
      if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
        if (!this.temp.hwHomeworkGroup.groupMaxNum) {
          callback(new Error('请先输入最大作业数量'))
        } else if (this.temp.hwHomeworkGroup.groupMaxNum < value) {
          callback(new Error('最大允许提交数量不能大于最大作业数量'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入正整数'))
      }
    },
    save(state) {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let val = '正在发布中...'
          let valend = '发布成功'
          let errvalend = '发布成功'
          if (state === '0') {
            val = '正在保存中...'
            valend = '保存成功'
            errvalend = '保存成功'
          }
          const loading = this.load(val, true)
          this.temp.hwHomeworkGroup.groupSubjectState = state
          this.temp.homeworkList.forEach(function(a, b) {
            a.hwHomework.subjectState = state
            if (!a.hwHomeworkMaterialYNParam) {
              a.hwHomeworkMaterialYNParam = {}
              a.hwHomeworkMaterialYNParam.listHwHomeworkClassRef = that.listHwHomeworkClassRef
            } else {
              a.hwHomeworkMaterialYNParam.listHwHomeworkClassRef = that.listHwHomeworkClassRef
            }
          })
          saveHwHomeworkGroup(this.temp).then(res => {
            if (res.success) {
              loading.setText(valend)
              setTimeout(() => {
                loading.close()
                this.$router.push({
                  path: '/system/homework/hwHomeworkGroup'
                })
              }, 1000)
              this.dialogFormVisible = false
            } else {
              loading.setText(errvalend)
              setTimeout(() => {
                loading.close()
              }, 1000)
            }
          })
        }
      })
    },
    update(state) {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let val = '正在发布中...'
          let valend = '发布成功'
          let errvalend = '发布成功'
          if (state === '0') {
            val = '正在保存中...'
            valend = '保存成功'
            errvalend = '保存成功'
          }
          const loading = this.load(val, true)
          this.temp.hwHomeworkGroup.groupSubjectState = state
          this.temp.homeworkList.forEach(function(a, b) {
            a.isUpdate = true
            a.hwHomework.subjectState = state
            if (!a.hwHomeworkMaterialYNParam) {
              a.hwHomeworkMaterialYNParam = {}
              a.hwHomeworkMaterialYNParam.listHwHomeworkClassRef = that.listHwHomeworkClassRef
            } else {
              a.hwHomeworkMaterialYNParam.listHwHomeworkClassRef = that.listHwHomeworkClassRef
            }
          })
          updateHwHomeworkGroups(this.temp).then(res => {
            if (res.success) {
              loading.setText(valend)
              setTimeout(() => {
                loading.close()
                this.$router.push({
                  path: '/system/homework/hwHomeworkGroup'
                })
              }, 1000)
              this.dialogFormVisible = false
            } else {
              loading.setText(errvalend)
              setTimeout(() => {
                loading.close()
              }, 1000)
            }
          })
        }
      })
    },
    fabuqian(state) {

    },
    transmissionDate(obj) {
      console.log(obj)
    },
    initialization() {
      if (this.dialogStatusnei === 'create') {
        this.$refs.mychild.settingTime(this.temp)
      } else {
        let pd = 'info'
        if (!this.chakan) {
          pd = 'update'
        }
        const obj = this.$refs.mychild.transmissionUpdateDate(this.currentRow, pd)
      }
    },
    eliminate() {
      this.$refs.mychild.eliminate()
    },
    selectionChange(val) {
      this.multipleSelection = val
    },
    updateAuditEndTime(rule, value, callback) {
      if (this.temp.hwHomeworkGroup.groupAuditEndTime) {
        if (new Date(this.temp.hwHomeworkGroup.groupAuditEndTime).getTime() <= new Date(this.temp.hwHomeworkGroup.groupEndTime).getTime()) {
          this.temp.hwHomeworkGroup.groupAuditEndTime = undefined
          this.temp.hwHomeworkGroup.groupQaEndTime = undefined
          callback(new Error('老师批改截止时间需要大于作业提交截止时间'))
          return false
        }
      }
      callback()
    },
    updateQaEndTime(rule, value, callback) {
      if (this.temp.hwHomeworkGroup.groupAuditEndTime) {
        if (new Date(this.temp.hwHomeworkGroup.groupAuditEndTime).getTime() <= new Date(this.temp.hwHomeworkGroup.groupEndTime).getTime()) {
          this.temp.hwHomeworkGroup.groupAuditEndTime = undefined
          this.temp.hwHomeworkGroup.groupQaEndTime = undefined
          callback(new Error('老师批改截止时间需要大于作业提交截止时间'))
          return false
        }
      } else {
        callback(new Error('请选择老师批改截止时间'))
        return false
      }

      if (this.temp.hwHomeworkGroup.groupQaEndTime) {
        if (new Date(this.temp.hwHomeworkGroup.groupQaEndTime).getTime() <= new Date(this.temp.hwHomeworkGroup.groupAuditEndTime).getTime()) {
          this.temp.hwHomeworkGroup.groupQaEndTime = undefined
          callback(new Error('学生追问截止时间需要大于老师批改截止时间'))
          return false
        }
      }
      callback()
    },
    updateQaEnd(rule, value, callback) {
      if (this.temp.hwHomeworkGroup.groupQaEndTime) {
        if (new Date(this.temp.hwHomeworkGroup.groupQaEndTime).getTime() <= new Date(this.temp.hwHomeworkGroup.groupAuditEndTime).getTime()) {
          this.temp.hwHomeworkGroup.groupQaEndTime = undefined
          callback(new Error('学生追问截止时间需要大于老师批改截止时间'))
          return false
        }
      } else {
        callback(new Error('请选择追问截止时间'))
        return false
      }
      callback()
    },
    classLists(val) {
      const that = this
      that.listHwHomeworkClassRef = []
      this.classTypeAndClass = val
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
      console.log(that.listHwHomeworkClassRef)
    },
    async getHwHomeworkClassRefList() {
      if (this.temp.hwHomeworkGroup.id) {
        const res = await getGroupHwHomeworkClassRefListByHomeworkId(this.temp.hwHomeworkGroup.id)
        return res.data
      }
      return []
    },
    async getClassAndClassType() {
      const ddd = await getClassAndClassTypeList(this.listQuery)
      return ddd.data.allClassAndClass
    },
    async getPageListByClassTypes(data) {
      const ddd = await getPageListByClassType(data)
      return ddd
    },
    classChoiceSetting() {
      this.classChoice = true
    },
    fetchData(row) {
      this.temp = { hwHomeworkGroup: row, homeworkList: [] }
      this.$nextTick(() => {
        this.listLoading = true
        gethwHomeworkList({ current: 1, size: 100, groupHomeworkId: row.id }).then(response => {
          if (response.success) {
            const homeworkList = []
            response.data.records.forEach(function(a, b) {
              homeworkList.push({ hwHomework: a })
            })
            // 组装数据
            const newRow = { hwHomeworkGroup: row, homeworkList: homeworkList }
            this.temp = newRow
          }
          this.listLoading = false
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        hwHomeworkGroup: {
          id: undefined,
          groupStartTime: undefined,
          groupEndTime: undefined,
          groupAuditEndTime: undefined,
          groupQaEndTime: undefined,
          groupName: undefined, // 暂时写死
          groupMaxNum: undefined, // 暂时写死
          groupAllowMaxNum: undefined,
          groupSubjectState: 0
        },
        homeworkList: []
      }
    },
    handleCreate() {
      if (!this.temp.hwHomeworkGroup.groupEndTime) {
        this.$message.error('请先完善作业组信息后添加作业！（提交截止时间）')
        return false
      }
      if (!this.temp.hwHomeworkGroup.groupQaEndTime) {
        this.$message.error('请先完善作业组信息后添加作业！（追问截止时间）')
        return false
      }
      if (!this.temp.hwHomeworkGroup.groupAuditEndTime) {
        this.$message.error('请先完善作业组信息后添加作业！（批改截止时间）')
        return false
      }
      if (this.listHwHomeworkClassRef.length < 1) {
        this.$message.error('请先完善作业组信息后添加作业！（班级）')
        return false
      }
      if (this.temp.homeworkList.length >= this.temp.hwHomeworkGroup.groupMaxNum) {
        this.$message.error('当前作业数' + this.temp.homeworkList.length + '，已达成最大作业数量上限，请删除作业后添加！')
        return false
      }
      this.dialogStatusnei = 'create'
      this.addVisible = true
    },
    batchDelete() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请先勾选要删除作业')
        return false
      }
      this.delVisible = true
      let subjectName = ''
      this.multipleSelection.forEach(function(a, b) {
        subjectName = subjectName + a.hwHomework.subjectName + ','
      })
      subjectName = subjectName.substring(0, subjectName.length - 1)
      this.subjectName = subjectName
      this.deleteor = 'deletes'
    },
    createData(state) {
      const obj = this.$refs.mychild.transmissionDate(state)
      if (obj) {
        this.addVisible = false
        obj.hwHomeworkMaterialYNParam['listHwHomeworkClassRef'] = this.listHwHomeworkClassRef
        this.zuzhuang(obj, this.listHwHomeworkClassRef)
        this.temp.homeworkList.push(obj)
      }
    },
    zuzhuang(obj, listHwHomeworkClassRef) {
      // 组装班级和标签
      let classTypeNames = ''
      let classNames = ''
      this.listHwHomeworkClassRef.forEach(function(a, b) {
        classTypeNames = classTypeNames.replace(a.classTypeName + ',', '') + a.classTypeName + ','
        classNames = classNames + a.className + ','
      })
      if (classTypeNames !== '') {
        classTypeNames = classTypeNames.substring(0, classTypeNames.length - 1)
      }
      if (classNames !== '') {
        classNames = classNames.substring(0, classNames.length - 1)
      }
      obj.hwHomework.classTypeName = classTypeNames
      obj.hwHomework.className = classNames
    },
    handleUpdate(row, index) {
      this.currentRow = row
      this.currentIndex = index
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusnei = 'update'
      this.addVisible = true
    },
    updateData(state) {
      const obj = this.$refs.mychild.transmissionDate(state)
      if (obj) {
        this.addVisible = false
        obj.hwHomeworkMaterialYNParam['listHwHomeworkClassRef'] = this.listHwHomeworkClassRef
        this.zuzhuang(obj, this.listHwHomeworkClassRef)
        obj.isUpdate = true
        this.temp.homeworkList.splice(this.currentIndex, 1, obj)
        // this.list.push(obj)
      }
      /*      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateUser(tempData).then(() => {
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
      })*/
    },
    handleDelete() {
      const row = this.row
      const index = this.rowIndex
      if (row.hwHomework.id) {
        // this.temp = Object.assign({}, row) // copy obj
        deletehwHomework(row.hwHomework.id).then(() => {
          this.temp.homeworkList.splice(index, 1)
          // this.fetchData()
          this.delVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      } else {
        this.temp.homeworkList.splice(index, 1)
        this.delVisible = false
      }
      this.row = { hwHomework: { subjetName: undefined }}
      this.rowIndex = undefined
    },
    handleDeletes() {
      const ids = []
      const indexs = []
      this.multipleSelection.forEach(function(a, b) {
        if (a.hwHomework.id) {
          ids.push(a.hwHomework.id)
        }
        indexs.push(a.index)
      })
      if (ids.length > 0) {
        deletehwHomeworks(ids).then(res => {
          if (res.success) {
            // 未选中的数据
            const newlist = this.temp.homeworkList.filter(item => indexs.indexOf(item.index) === -1)
            this.temp.homeworkList = newlist
            this.$notify({
              title: '成功',
              message: '批量删除成功！',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify({
              title: '失败',
              message: '批量删除失败！',
              type: 'error',
              duration: 2000
            })
          }
        })
      } else {
        const newlist = this.temp.homeworkList.filter(item => indexs.indexOf(item.index) === -1)
        this.temp.homeworkList = newlist
      }
      this.delVisible = false
    }
  }
}
</script>
<style>
  .app-container1 {
    padding-left: 100px;
    padding-right: 100px;
    padding-top: 0px;
  }
</style>
