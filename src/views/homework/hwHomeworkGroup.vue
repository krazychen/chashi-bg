<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.groupName" placeholder="作业组名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.classId"
        placeholder="班级"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in classs" :key="item.id" :label="item.className" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.groupSubjectState" placeholder="状态" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in groupSubjectStates" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <!--      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
        删除
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
        width="55"
      />
      <el-table-column align="center" label="作业组名称" width="200" fixed>
        <template slot-scope="scope">
          {{ scope.row.groupName }}
        </template>
      </el-table-column>
      <el-table-column label="最大数量" align="center" fixed>
        <template slot-scope="scope">
          {{ scope.row.groupMaxNum }}
        </template>
      </el-table-column>
      <el-table-column label="最大允许提交数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupAllowMaxNum }}
        </template>
      </el-table-column>
      <el-table-column label="班级" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column label="作业开始时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupStartTime }}
        </template>
      </el-table-column>
      <el-table-column label="作业提交截止时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupEndTime }}
        </template>
      </el-table-column>
      <el-table-column label="老师批改截止时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupAuditEndTime }}
        </template>
      </el-table-column>
      <el-table-column label="学员追问截止时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.groupQaEndTime }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center" :formatter="stateFormat" prop="groupSubjectState" />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.groupSubjectState==='0'">
            <i
              class="el-icon-edit"
              style="color: #67C23A;margin-left:10px;"
              type="primary"
              title="编辑"
              @click="bianji(scope.row,'update')"
            />
            <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="tableDeleteRow(scope.row,'delete')" />
            <i class="el-icon-folder-checked" title="发布" tooltip="true" style="color: #409EFF;margin-left:15px;" @click="readyToRelease(scope.row,'rel')" />
          </div>
          <div v-else>
            <i class="el-icon-camera" title="查看" tooltip="true" style="color: #315FC2;margin-left:15px;" type="primary" @click="chakan(scope.row,'info')" />
            <i title="取消发布" class="el-icon-circle-close" style="color: #F56C6C;margin-left:10px;" @click="readyToRelease(scope.row,'norel')" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">是否删除作业组，请确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 发布提示框 -->
    <el-dialog title="提示" :visible.sync="relVisible" width="300px" center>
      <div class="del-dialog-cnt">{{ rel === 'rel' ? '是否发布作业组，请确认！':'是否取消作业发布组，请确认！' }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relVisible = false">取 消</el-button>
        <el-button type="primary" @click="rel==='rel'?handleRelease():handleNoRelease()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHwHomeworkGroupList, deleteHwHomeworkGroup, deleteHwHomeworkGroups, releaseHwHomeworkGroups, noReleaseHwHomeworkGroups } from '@/api/homework/hwHomeworkGroup'

import { getUserList, createUser, updateUser, deleteUser } from '@/api/system/user'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import { getDictDataList } from '@/utils/dictUtils'
import { getAllClass } from '@/api/homework/hwClass'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return stateMap[state]
    },
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  data() {
    return {
      rel: 'rel',
      relRow: undefined,
      relVisible: false,
      delarr: [],
      delVisible: false,
      rowr: undefined,
      deleteor: 'delete',
      multipleSelection: [],
      classs: [],
      groupSubjectStates: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        groupSubjectState: undefined,
        classId: undefined,
        groupName: undefined
      },
      temp: {
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        phone: '',
        gender: 1,
        state: '0',
        departmentId: 1, // 暂时写死
        roleId: 1 // 暂时写死
      },
      usernameDisabled: false
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.groupSubjectStates = getDictDataList('hw_class_type_status')
    getAllClass().then(res => {
      if (res.success) {
        this.classs = res.data
      }
    })
    this.fetchData()
  },
  methods: {
    bianji(row, pd) {
      this.$router.push({
        path: '/system/homework/addHwHomeworkGroup',
        query: {
          row: row,
          pd: pd
        }
      })
    },
    chakan(row, pd) {
      this.$router.push({
        path: '/system/homework/addHwHomeworkGroup',
        query: {
          row: row,
          pd: pd
        }
      })
    },
    handleRelease() {
      releaseHwHomeworkGroups(this.relRow.id).then(res => {
        if (res.success) {
          this.fetchData()
          this.relVisible = false
          this.$notify({
            title: '成功',
            message: '发布成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '发布失败！',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleNoRelease() {
      noReleaseHwHomeworkGroups(this.relRow.id).then(res => {
        if (res.success) {
          this.fetchData()
          this.relVisible = false
          this.$notify({
            title: '成功',
            message: '取消发布成功！',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '取消发布失败！',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    readyToRelease(row, type) {
      if (type === 'rel') {
        if (!row.groupSubjectState === 0 || !row.groupSubjectState === 2) {
          this.$message.error('该作业组已发布')
          return false
        }
        this.rel = 'rel'
      } else {
        if (!row.groupSubjectState === 1) {
          this.$message.error('该作业还未发布')
          return false
        }
        this.rel = 'norel'
      }
      this.relVisible = true
      this.relRow = row
      this.rel = type
    },
    handleDeletes() {
      const length = this.multipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        delarr.push(this.multipleSelection[i].id)
      }
      deleteHwHomeworkGroups(delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
        this.delVisible = false
      })
    },
    deleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message.error('请选择一条数据！')
        } else {
          const length = this.multipleSelection.length
          this.delarr = []
          for (let i = 0; i < length; i++) {
            if (this.multipleSelection[i].status === 1) {
              this.$message.error(row.groupName + '已发布，不能进行删除，请取消发布后删除')
              return false
            }
            if (this.multipleSelection[i].status === 2) {
              this.$message.error('已冻结无法删除')
              return false
            }
            this.delarr.push(this.multipleSelection[i].areaCode)
          }
          this.delVisible = true
        }
      }
    },
    rest() {
      this.listQuery = {
        current: 1,
        groupSubjectState: undefined,
        classId: undefined,
        groupName: undefined
      }
      this.fetchData()
    },
    stateFormat(row, type) {
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.listLoading = true
      getHwHomeworkGroupList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        phone: '',
        gender: 1,
        state: '0',
        departmentId: 1, // 暂时写死
        roleId: 1 // 暂时写死
      }
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
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
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteHwHomeworkGroup(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
