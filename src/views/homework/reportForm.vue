<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.subjectName" placeholder="作业名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        v-model="listQuery.subjectTypeId"
        placeholder="题型"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in subjectTypes" :key="item.id" :label="item.typeName" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="dateTiems"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        class="filter-item"
        @change="dateTimeBinding"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        筛选
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
      <el-table-column align="center" label="题目名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column label="题型" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业开始时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业截止提交时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesSubState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未提交人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.noSubState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已批改数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.yesAuditState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未批改数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.noAuditState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="追问人数" align="center">
        <template slot-scope="scope">
          <span>{{ new Number(scope.row.yesQaState)+ new Number(scope.row.noQaState) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未回复数量" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.noQaState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="details(scope.row)"
          >详情</a>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getReportFormList } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/subjectType'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'ReportForm',
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
    },
    currentTeacher: {
      type: String,
      default: '0'
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
      subjectTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        subjectName: undefined,
        startTime: undefined,
        endTime: undefined,
        subjectTypeId: undefined,
        currentTeacher: '0'
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    getHwSubjectTypeList().then(res => {
      if (res.success) {
        this.subjectTypes = res.data
      }
    })
    this.listQuery.currentTeacher = this.currentTeacher
    this.fetchData()
  },
  methods: {
    details(row) {
      this.viewDetails(row)
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
      getReportFormList(this.listQuery).then(response => {
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
