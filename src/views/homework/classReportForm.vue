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
      <el-table-column align="center" label="班级名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column label="班级人数" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.stuCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="该班级提交人数" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.yesSubCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="该班级未提交人数" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.noSubCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已批改数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesAuditCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未批改数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.noAuditCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="追问人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesQaCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已经答复数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesQaReplyCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未答复数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesQaCount - scope.row.yesQaReplyCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="details(listQuery.id,scope.row)"
          >详情</a>
          <!--<a ref="/homework/reportForm/class" style="color: #1AFFED">详情</a>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getClassReportFormList, getHwHomework } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'ClassReportForm',
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
  props: {
    viewDetails: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
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
      subjectTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        subjectName: undefined,
        startTime: undefined,
        endTime: undefined,
        subjectTypeId: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.listQuery.id = this.$route.params.id
    getHwHomework(this.listQuery.id).then(res => {
      if (res.success && res.data != null && res.data) {
        const data = res.data
        this.subjectName = data.subjectName
        this.startTime = data.startTime
        this.endTime = data.endTime
      }
    })
    this.fetchData()
  },
  methods: {
    details(id, row) {
      this.viewDetails(id, row)
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
      getClassReportFormList(this.listQuery).then(response => {
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
