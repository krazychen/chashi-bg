<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.delegetionClass"
        placeholder="班级"
        clearable
        multiple
        collapse-tags
        style="width: 200px"
        filterable
        class="filter-item"
      >
        <el-option v-for="item in classs" :key="item.id" :label="item.className" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.delegetionTeacher"
        placeholder="一级老师"
        clearable
        multiple
        collapse-tags
        filterable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in teacherList" :key="item.id" :label="item.nickname?item.name+'（'+item.nickname+'）':item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restListQuery">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
      <el-table-column align="center" label="委托班级">
        <template slot-scope="scope">
          {{ scope.row.delegetionClassNames }}
        </template>
      </el-table-column>
      <el-table-column label="委托老师" align="center">
        <template slot-scope="scope">
          {{ scope.row.delegetionTeacherNames }}
        </template>
      </el-table-column>
      <el-table-column label="委托开始时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.delegetionStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="委托结束时间" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.delegetionEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="deleteDes(scope.row)">
            删除委托
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog title="创建" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 450px; margin-left:50px;">
        <el-form-item label="委托班级" prop="delegetionClass">
          <el-select
            v-model="delegetionClass"
            placeholder="请选择委托班级"
            clearable
            multiple
            collapse-tags
            :style="selectwidthz"
            @change="selectClassChange"
          >
            <el-option v-for="item in classsDele" :key="item.id" :label="item.className" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="委托老师" prop="delegetionTeacher">
          <el-select
            v-model="delegetionTeacher"
            placeholder="请选择委托老师"
            clearable
            multiple
            collapse-tags
            filterable
            :style="selectwidthz"
            @change="selectTeacherChange"
          >
            <el-option v-for="item in teacherList" :key="item.id" :label="item.nickname?item.name+'（'+item.nickname+'）':item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="委托开始时间" prop="delegetionStartTime">
          <el-date-picker
            v-model="temp.delegetionStartTime"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :style="selectwidthz"
          />
        </el-form-item>
        <el-form-item label="委托结束时间" prop="delegetionEndTime">
          <el-date-picker
            v-model="temp.delegetionEndTime"
            type="datetime"
            placeholder="选择日期"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :style="selectwidthz"
          />
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

    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">是否确认删除委托？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDelete()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="subVisible" width="500px">
      <div class="del-dialog-cnt" style="line-height: 24px;">
        <span style="font-size: 15px;font-weight: bold">
          是否确认在
        </span><br>
        <span>
          {{ temp.delegetionStartTime }}~{{ temp.delegetionEndTime }}
        </span><br>
        <span style="font-size: 15px;font-weight: bold">
          将
        </span>
        <br>
        <span>
          {{ className }}
        </span><br>
        <span style="font-size: 15px;font-weight: bold">
          班级的作业委托给
        </span><br>
        <span>
          {{ teacherName }}
        </span><br>
        <span style="font-size: 15px;font-weight: bold">
          老师吗？
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="disSubmit" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, addHwHomeworkDelegation, deleteDe } from '@/api/homework/hwDelegation'
import { getOneTeacherList } from '@/api/homework/teacher'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getAllClass, getHwDelegationClass } from '@/api/homework/hwClass'
// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'HwDelegation',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      disSubmit: false,
      row: {},
      delVisible: false,
      subVisible: false,
      classs: [],
      classsDele: [],
      teacherList: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        delegetionClass: [],
        delegetionTeacher: []
      },
      delegetionTeacher: [],
      delegetionClass: [],
      temp: {
        delegetionClass: undefined,
        delegetionTeacher: undefined,
        delegetionStartTime: undefined,
        delegetionEndTime: undefined
      },
      className: '',
      teacherName: '',
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      rules: {
        delegetionClass: [{ required: true, message: '请选择委托班级', trigger: 'blur' }],
        delegetionTeacher: [{ required: true, message: '请选择委托老师', trigger: 'blur' }],
        delegetionStartTime: [{ required: true, message: '请选择委托开始时间', trigger: 'blur' }],
        delegetionEndTime: [{ required: true, message: '请选择委托结束时间', trigger: 'blur' }]
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
    getAllClass().then(res => {
      if (res.success) {
        this.classs = res.data
      }
    })
    this.getClassDele()
    getOneTeacherList().then(res => {
      if (res.success) {
        this.teacherList = res.data
      }
    })
    this.fetchData()
  },
  methods: {
    getClassDele() {
      getHwDelegationClass().then(res => {
        if (res.success) {
          this.classsDele = res.data
        }
      })
    },
    deleteDes(row) {
      this.delVisible = true
      this.row = row
    },
    selectTeacherChange(vals) {
      this.temp.delegetionTeacher = undefined
      let val = ''
      if (vals.length > 0) {
        vals.forEach(function(a, b) {
          val = val + a + ','
        })
        this.temp.delegetionTeacher = val.substr(0, val.lastIndexOf(','))
      }
      console.log(this.temp.delegetionTeacher)
    },
    selectClassChange(vals) {
      this.temp.delegetionClass = undefined
      let val = ''
      if (vals.length > 0) {
        vals.forEach(function(a, b) {
          val = val + a + ','
        })
        this.temp.delegetionClass = val.substr(0, val.lastIndexOf(','))
      }
      console.log(this.temp.delegetionClass)
    },
    fetchData() {
      this.listLoading = true
      getPageList(this.listQuery).then(response => {
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
    restListQuery() {
      this.listQuery = {
        current: 1,
        delegetionClass: [],
        delegetionTeacher: []
      }
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        delegetionClass: undefined,
        delegetionTeacher: undefined,
        delegetionStartTime: undefined,
        delegetionEndTime: undefined
      }
      this.delegetionClass = []
      this.delegetionTeacher = []
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
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.subVisible = true
          let className = ''
          this.delegetionClass.forEach(function(a, b) {
            // debugger
            const row = that.classs.find(item => item.id === a)
            className = className + row.className + '、'
          })
          className = className.substr(0, className.lastIndexOf('、'))
          this.className = className
          let teacherName = ''
          this.delegetionTeacher.forEach(function(a, b) {
            const row = that.teacherList.find(item => item.id === a)
            teacherName = teacherName + row.name + '、'
          })
          teacherName = teacherName.substr(0, teacherName.lastIndexOf('、'))
          this.teacherName = teacherName
        }
      })
    },
    submit() {
      this.disSubmit = true
      addHwHomeworkDelegation(this.temp).then(res => {
        // this.list.unshift(this.temp)
        this.disSubmit = false
        if (res.success && res.data != null && res.data) {
          this.subVisible = false
          this.getClassDele()
          this.fetchData()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
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
      }).catch(res => {
        this.$notify({
          title: '失败',
          message: res.msg,
          type: 'error',
          duration: 2000
        })
      })
    },
    handleDelete() {
      deleteDe(this.row.id).then(res => {
        this.delVisible = false
        if (res.success) {
          this.getClassDele()
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
      }).catch(res => {
        this.$notify({
          title: '失败',
          message: '删除失败',
          type: 'error',
          duration: 2000
        })
      })
    }
  }
}
</script>
