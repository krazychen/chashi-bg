<template>
  <div class="app-container">
    <div class="filter-container">

      <el-tag class="biaoqian" effect="dark">
        <div :class="subjectName.length>19?'haha':'hahas'">
          {{ subjectName }}
        </div>
      </el-tag>

      <el-tag type="success" class="biaoqian" effect="dark">
        <div class="hahas">
          {{ startTime }}{{ startTime&&endTime?'至':'' }}{{ endTime }}
        </div>
      </el-tag>

      <el-tag type="info" class="biaoqian" effect="dark">
        <div :class="className.length>19?'haha':'hahas'">
          {{ className }}
        </div>
      </el-tag>

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
      <el-table-column align="center" label="学员账号" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="学员昵称" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业状态" align="center" width="150" prop="subState" :formatter="menuTypeFormat" />
      <el-table-column label="作业分数" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批改人账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批改人昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditNickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repeatUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repratNickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批改标签" align="center" prop="jobTag" :formatter="menuTypeFormat" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="seeShare('/system/homework/'+scope.row.id+'/formView/0',scope.row.id+'form')"
          >详情</a>
          <!--<a ref="/homework/reportForm/class" style="color: #1AFFED">详情</a>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getStudentReportFormList, getHwHomeworkAndClass } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import { getDictDataList } from '@/utils/dictUtils'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'StudentReportForm',
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
      jobTags: [],
      subStates: [],
      dateTiems: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      subjectName: '',
      startTime: undefined,
      endTime: undefined,
      className: '',
      subjectTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        homeworkId: undefined,
        classId: undefined
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
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      genders: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
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
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.jobTags = getDictDataList('hw_homework_job_tag')
    this.subStates = getDictDataList('hw_homework_submit_status')
    const length = this.$router.history.current.matched.length
    let url = this.$router.history.current.matched[length - 1].parent.redirect
    this.listQuery.homeworkId = this.$route.params.homeworkId
    this.listQuery.classId = this.$route.params.classId
    url = url.substring(0, url.lastIndexOf('/')) + '/' + this.listQuery.homeworkId
    this.$router.history.current.matched[3].parent.redirect = url
    getHwHomeworkAndClass(this.listQuery).then(res => {
      if (res.success && res.data != null && res.data) {
        const data = res.data
        this.subjectName = data.subjectName
        this.startTime = data.startTime
        this.endTime = data.endTime
        this.className = data.className
      }
    })
    this.fetchData()
  },
  methods: {
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
    },
    seeShare(url, id) {
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.open(routeUrl.href, '' + id)
    },
    dateTimeBinding(values) {
      if (values[0] && values[1]) {
        this.listQuery.startTime = values[0]
        this.listQuery.endTime = values[1]
        console.log(this.listQuery)
      } else {
        this.listQuery.startTime = undefined
        this.listQuery.endTime = undefined
      }
    },
    fetchData() {
      this.listLoading = true
      getStudentReportFormList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.current = 1
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .el-tag--small {

    padding: 0 8px;
    line-height: 1.5em;
    font-size: 18px;
    min-height: 5em;
    margin-right: 1em;
    margin-bottom: 1em;
  }

  .haha {
    width: 20em;
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

  .hahas {
    width: 20em;
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 3em;
    line-height: 3em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

</style>
