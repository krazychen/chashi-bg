<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.typeName"
        placeholder="题型名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.remarks"
        placeholder="备注"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="tableDeleteRow('','deletes')">
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
        width="55px"
      />
      <el-table-column align="center" label="题型名称">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            class="el-icon-edit"
            title="编辑"
            tooltip="true"
            style="color: #67C23A;margin-left:20px;"
            type="primary"
            @click="handleUpdate(scope.row)"
          />
          <i
            class="el-icon-delete"
            title="删除"
            tooltip="true"
            style="color: #F56C6C;margin-left:20px;"
            type="primary"
            @click="tableDeleteRow(scope.row,'delete')"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px" @closed="chaojirest">
      <div style="height: 600px">
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 420px; margin-left:20px;"
        >
          <el-form-item label="题型名称" prop="typeName">
            <el-input v-model="temp.typeName" placeholder="请输入题型名称" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="temp.remarks" placeholder="请输入备注信息" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" style="margin-left: 20px;margin-right: 20px;">
          <el-tab-pane label="一级老师列表" name="first">

            <el-button
              v-waves
              class="filter-item"
              type="primary"
              @click="displayTeacher"
            >添加一级老师
            </el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(1)">批量删除</el-button>
            <el-table
              v-loading="listLoading"
              :data="teacherList1"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              height="360px"
              style="margin-top: 16px"
              @selection-change="selectionChangefirstwx"
            >
              <el-table-column
                type="selection"
                label="勾选"
                width="55px"
              />
              <el-table-column align="center" label="用户" width="150">
                <template slot-scope="scope">
                  {{ scope.row.username }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="昵称" width="150">
                <template slot-scope="scope">
                  {{ scope.row.nickname }}
                </template>
              </el-table-column>
              <el-table-column label="手机" width="150" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column label="微信" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.wxOpenid }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelationSen2(scope.row,1)" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="查看老师列表" name="see">
            <el-button
              v-waves
              class="filter-item"
              type="primary"
              @click="displayTeacherSee"
            >添加查看老师
            </el-button>
            <el-button size="small" type="primary" style="margin-bottom: 10px" @click="firstDelete(2)">批量删除</el-button>
            <el-table
              v-loading="listLoadingSee"
              :data="teacherListSee"
              element-loading-text="Loading"
              border
              highlight-current-row
              height="360px"
              style="margin-top: 16px"
              @selection-change="selectionChangeSeewx"
            >
              <el-table-column
                type="selection"
                label="勾选"
                width="55px"
              />
              <el-table-column align="center" label="用户" width="150">
                <template slot-scope="scope">
                  {{ scope.row.username }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="昵称" width="150">
                <template slot-scope="scope">
                  {{ scope.row.nickname }}
                </template>
              </el-table-column>
              <el-table-column label="手机" width="150" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column label="微信" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.wxOpenid }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRelationSen2(scope.row,2)" />
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs></div>

      <!--<pagination v-show="teacherTotal1>0" :total="teacherTotal1" :page.sync="teacherListQuery1.current" :limit.sync="teacherListQuery1.size" @pagination="findTeacherList1" />-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="一级老师" :visible.sync="dialogFormVisible1" @open="fourOpen(1)" @close="quxiao">
      <div class="filter-container">
        <el-input
          v-model="teacherListQuery.username"
          placeholder="用户名"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuery.nickname"
          placeholder="昵称"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuery.phone"
          placeholder="手机"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuery.wxOpenid"
          placeholder="微信"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter1">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest1">
          重置
        </el-button>
      </div>
      <div class="el-dialog-div">
        <el-table
          ref="multipleTable"
          :data="teacherList"
          style="width: 100%"
          :row-key="getRowKeysecond"
          @selection-change="handleSelectionChange1"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column align="center" label="用户" width="150">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称" width="150">
            <template slot-scope="scope">
              {{ scope.row.nickname }}
            </template>
          </el-table-column>
          <el-table-column label="手机" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="微信" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.wxOpenid }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="teacherTotal>0"
        :total="teacherTotal"
        :page.sync="teacherListQuery.current"
        :limit.sync="teacherListQuery.size"
        :page-sizes="[20, 40, 60, 80]"
        @pagination="findTeacherList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiao">
          取消
        </el-button>
        <el-button type="primary" @click="addTeachers">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看老师" :visible.sync="dialogFormVisibleSee" @open="fourOpen(2)" @close="quxiaoSee">
      <div class="filter-container">
        <el-input
          v-model="teacherListQuerySee.username"
          placeholder="用户名"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuerySee.nickname"
          placeholder="昵称"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuerySee.phone"
          placeholder="手机"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-input
          v-model="teacherListQuerySee.wxOpenid"
          placeholder="微信"
          style="width: 150px;"
          class="filter-item"
          @keyup.enter.native="handleFilter1"
        />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterSee">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restSee">
          重置
        </el-button>
      </div>
      <div class="el-dialog-div">
        <el-table
          ref="multipleTableSee"
          :data="teacherListSees"
          style="width: 100%"
          :row-key="getRowKeysecond"
          @selection-change="handleSelectionChangeSee"
        >
          <el-table-column
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column align="center" label="用户" width="150">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="昵称" width="150">
            <template slot-scope="scope">
              {{ scope.row.nickname }}
            </template>
          </el-table-column>
          <el-table-column label="手机" width="150" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="微信" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.wxOpenid }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        v-show="teacherTotalSee>0"
        :total="teacherTotalSee"
        :page.sync="teacherListQuerySee.current"
        :limit.sync="teacherListQuerySee.size"
        :page-sizes="[20, 40, 60, 80]"
        @pagination="findTeacherListSee"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiaoSee">
          取消
        </el-button>
        <el-button type="primary" @click="addTeachersSee">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSubjectTypeList,
  createSubjectType,
  updateSubjectType,
  deleteSubjectType,
  batchDeletes,
  getTeacherListExit,
  getListAll,
  getIsSubjectTypeName,
  checkSubjectNameValid,
  deleteSubjectTypeAndTeacher,
  deleteSubjectTypeAndTeacherBatch
} from '@/api/homework/subjectType'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { debounce } from '../../utils' // waves directive

export default {
  name: 'SubjectType',
  components: { Pagination },
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
      activeName: 'first',
      subjectIdd: undefined,
      rowr: {},
      delVisible: false,
      list: null,
      list1: [],
      teacherList: [],
      teacherListSees: [],
      teacherList1: [],
      teacherList11: [],
      teacherListSee: [],
      teacherListSeeSee: [],
      listLoading: true,
      listLoadingSee: false,
      total: 0,
      teacherTotal: 0,
      teacherTotalSee: 0,
      teacherTotal1: 0,
      listQuery: {
        current: 1,
        typeName: undefined,
        remarks: undefined
      },
      teacherListQuery: {
        size: 20,
        username: '',
        nickname: '',
        wxOpenid: '',
        phone: '',
        type: 'leve1teacher',
        subjectTypeId: '',
        current: 1
      },
      teacherListQuerySee: {
        username: '',
        nickname: '',
        wxOpenid: '',
        phone: '',
        type: 'seeteacher',
        subjectTypeId: '',
        current: 1
      },
      teacherListQuery1: {
        subjectTypeId: ''
      },
      temp: {
        id: undefined,
        typeName: '',
        remarks: '',
        teachers: [],
        teachersSee: [],
        status: 1
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisibleSee: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        typeName: [{ required: true, message: '请输入名称', trigger: 'blur' }, {
          trigger: 'blur',
          validator: this.subjectNameVerification
        }]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.fetchData()
  },
  methods: {
    chaojirest() {
      this.activeName = 'first',
      this.teacherList1 = []
      this.teacherList11 = []
      this.teacherListSee = []
      this.teacherListSeeSee = []
      this.temp.teachersSee = []
      this.temp.teachers = []
      this.teacherListQuery = {
        username: '',
        nickname: '',
        wxOpenid: '',
        phone: '',
        type: 'leve1teacher',
        subjectTypeId: '',
        current: 1
      },
      this.teacherListQuerySee = {
        username: '',
        nickname: '',
        wxOpenid: '',
        phone: '',
        type: 'seeteacher',
        subjectTypeId: '',
        current: 1
      }
    },
    fourOpen(type) {
      let obj
      let rows
      if (type === 1) {
        obj = this.$refs.multipleTable
        rows = this.teacherList1
      } else if (type === 2) {
        obj = this.$refs.multipleTableSee
        rows = this.teacherListSee
      }
      if (obj !== undefined && rows !== undefined) {
        this.toggleSelection(rows, obj)
      }
    },
    selectionChangefirstwx(val) {
      this.firstDeleteList = val
    },
    selectionChangeSeewx(val) {
      this.seeDeleteList = val
    },
    firstDelete(type) {
      if (type === 1) {
        this.firstDeleteBatch(this.firstDeleteList, this.teacherList1, this.teacherList11, '一级老师')
      } else if (type === 2) {
        this.firstDeleteBatch(this.seeDeleteList, this.teacherListSee, this.teacherListSeeSee, '查看老师')
      }
    },
    firstDeleteBatch(val, obj, objcs, name) {
      // 批量删除学员
      const that = this
      const ids = []
      if (val !== undefined && val.length > 0) {
        val.forEach(function(a, b) {
          if (a.relationId) {
            ids.push(a.relationId)
          } else {
            obj.splice(obj.findIndex(item => item.id === a.id), 1)
          }
        })
        if (ids.length > 0) {
          // 执行批量删除
          deleteSubjectTypeAndTeacherBatch(ids).then(res => {
            if (res.success && res.data !== null && res.data) {
              for (let i = 0; i < ids.length; i++) {
                obj.splice(obj.findIndex(item => item.relationId === ids[i]), 1)
                objcs.splice(objcs.findIndex(item => item.relationId === ids[i]), 1)
              }
              that.$message.success('删除' + name + '成功')
            } else {
              that.$message.success('删除' + name + '失败')
            }
          })
        } else {
          that.$message.success('删除' + name + '成功')
        }
      } else {
        this.$message.error('请先选择要删除的' + name)
      }
    },
    async deleteRelationSen2(row, type) {
      let obj
      let obj1
      if (type === 1) {
        obj = this.teacherList1
        obj1 = this.teacherList11
      } else if (type === 2) {
        obj = this.teacherListSee
        obj1 = this.teacherListSeeSee
      }
      if (obj !== undefined) {
        if (row.relationId) {
          const res = await deleteSubjectTypeAndTeacher(row.relationId)
          if (res.success && res.data !== null && res.data) {
            obj.splice(obj.findIndex(item => item.id === row.id), 1)
            obj1.splice(obj1.findIndex(item => item.id === row.id), 1)
            this.$message.success('删除关联成功')
          } else {
            this.$message.error('删除关联失败')
          }
        } else {
          await obj.splice(obj.findIndex(item => item.id === row.id), 1)
          this.$message.success('移除成功')
        }
      }
    },
    subjectNameVerification(rule, value, callback) {
      // 判断是编辑还是新增
      let map = {}
      if (this.dialogStatus === 'update') {
        map = { id: this.subjectIdd, subjectName: value }
      } else {
        map = { subjectName: value }
      }
      checkSubjectNameValid(map).then(res => {
        if (res.data != null && res.data) {
          callback()
        } else {
          callback(new Error('已经存在' + this.temp.typeName + '题型，请重新输入题型！'))
        }
      })
    },
    toggleSelection(rows, obj) {
      if (rows) {
        rows.forEach(row => {
          if (!row.relationId) {
            obj.toggleRowSelection(row)
          }
        })
      } else {
        obj.clearSelection()
      }
    },
    getRowKeysecond(row) {
      return row.id
    },
    isTypeNameValidator(rule, value, callback) {
      if (value) {
        const data = { 'subjectTypeName': value, 'id': this.temp.id }
        getIsSubjectTypeName(data).then(res => {
          if (res.data != null && res.data) {
            callback()
          } else {
            this.temp.typeName = undefined
            callback(new Error('题型名称已存在'))
          }
        })
      }
    },
    fetchData() {
      this.listLoading = true
      getSubjectTypeList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    tableDeleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
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
        } else {
          this.delVisible = true
        }
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        typeName: '',
        remarks: '',
        teachers: [],
        teacherSee: [],
        status: 1,
        version: 0
      }
    },
    handleFilter1() {
      this.teacherListQuery.page = 1
      this.findTeacherList()
    },
    handleFilterSee() {
      this.teacherListQuerySee.page = 1
      this.findTeacherListSee()
    },
    findTeacherListSee() {
      getTeacherListExit(this.teacherListQuerySee).then(response => {
        console.log(response.data)
        this.teacherListSees = response.data.records
        this.teacherTotalSee = parseInt(response.data.total)
        this.listLoadingSee = false
      })
    },
    findTeacherList() {
      getTeacherListExit(this.teacherListQuery).then(response => {
        console.log(response.data)
        this.teacherList = response.data.records
        this.teacherTotal = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    findTeacherList1() {
      getListAll(this.teacherListQuery1).then(response => {
        if (response.success && response.data !== null && response.data) {
          const arr = response.data.teacherList1
          this.teacherList1 = [...arr]
          this.teacherList11 = [...arr]
          const arr1 = response.data.teacherListSee
          this.teacherListSee = [...arr1]
          this.teacherListSeeSee = [...arr1]
          this.listLoading = false
        }
      })
    },
    handleCreate() {
      this.teacherListQuery.subjectTypeId = ''
      this.teacherListQuery1.subjectTypeId = ''
      this.teacherListQuerySee.subjectTypeId = ''
      this.findTeacherList()
      this.findTeacherListSee()
      this.teacherList1 = []
      this.teacherListSee = []
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
          this.temp.teachers = []
          if (this.teacherList1 !== undefined && this.teacherList1.length > 0) {
            const length = this.teacherList1.length

            for (let i = 0; i < length; i++) {
              const map = { id: this.teacherList1[i].id, value: this.teacherList1[i].roleIds }
              this.temp.teachers.push(map)
            }
          }
          this.temp.teachersSee = []
          console.log(this.teacherListSee)
          if (this.teacherListSee !== undefined && this.teacherListSee.length > 0) {
            const length1 = this.teacherListSee.length
            for (let i = 0; i < length1; i++) {
              const map = { id: this.teacherListSee[i].id, value: this.teacherListSee[i].roleIds }
              this.temp.teachersSee.push(map)
            }
          }
          // this.temp.teachers = this.list1
          createSubjectType(this.temp).then(() => {
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
      this.teacherListQuery.subjectTypeId = row.id
      // this.findTeacherList()
      this.teacherListQuery1.subjectTypeId = row.id
      this.teacherListQuerySee.subjectTypeId = row.id
      this.findTeacherList1()
      this.temp = Object.assign({}, row) // copy obj
      this.temp.teachers = []
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.subjectIdd = row.id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.teachers = []
          if (this.teacherList1 !== undefined && this.teacherList1.length > 0) {
            const length = this.teacherList1.length

            for (let i = 0; i < length; i++) {
              const map = { id: this.teacherList1[i].id, value: this.teacherList1[i].roleIds }
              tempData.teachers.push(map)
            }
          }
          tempData.teachersSee = []
          console.log(this.teacherListSee)
          if (this.teacherListSee !== undefined && this.teacherListSee.length > 0) {
            const length1 = this.teacherListSee.length
            for (let i = 0; i < length1; i++) {
              const map = { id: this.teacherListSee[i].id, value: this.teacherListSee[i].roleIds }
              tempData.teachersSee.push(map)
            }
          }
          updateSubjectType(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.subjectIdd = undefined
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
    handleDelete() {
      this.delVisible = false
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteSubjectType(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() {
      this.listQuery.typeName = undefined
      this.listQuery.remarks = undefined
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
      // this.teacherList1 = this.multipleSelection1
      // this.temp.teachers = this.list1
    },
    handleSelectionChangeSee(val) {
      this.multipleSelectionSee = val
      // this.teacherList1 = this.multipleSelection1
      // this.temp.teachers = this.list1
    },
    handleDeletes() {
      const length = this.multipleSelection.length
      this.temp.delarr = []
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      this.delVisible = false
      batchDeletes(this.temp.delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    displayTeacher() {
      this.dialogFormVisible1 = true
      this.$nextTick(function() {
        this.findTeacherList()
      })
    },
    displayTeacherSee() {
      this.dialogFormVisibleSee = true
      this.$nextTick(function() {
        this.findTeacherListSee()
      })
    },
    addTeachers() {
      const arr = [...this.teacherList11, ...this.multipleSelection1]
      this.teacherList1 = [...arr]
      this.$refs.multipleTable.clearSelection()
      this.dialogFormVisible1 = false
    },
    quxiaoSee() {
      this.dialogFormVisibleSee = false
      this.$refs.multipleTableSee.clearSelection()
    },
    quxiao() {
      this.dialogFormVisible1 = false
      this.$refs.multipleTable.clearSelection()
    },
    addTeachersSee() {
      const arr = [...this.teacherListSeeSee, ...this.multipleSelectionSee]
      this.teacherListSee = [...arr]
      this.$refs.multipleTableSee.clearSelection()
      this.dialogFormVisibleSee = false
    },
    rest1() { // 重置老师搜索
      this.teacherListQuery.username = ''
      this.teacherListQuery.nickname = ''
      this.teacherListQuery.wxOpenid = ''
      this.teacherListQuery.phone = ''
      this.findTeacherList()
    },
    restSee() { // 重置老师搜索
      this.teacherListQuerySee.username = ''
      this.teacherListQuerySee.nickname = ''
      this.teacherListQuerySee.wxOpenid = ''
      this.teacherListQuerySee.phone = ''
      this.findTeacherListSee()
    }
  }
}
</script>

<style scoped>
  .el-dialog-div{
    height: 278px;
    overflow: auto;
  }
</style>
