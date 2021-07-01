<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.homeworkId"
        filterable
        placeholder="作业名称"
        clearable
        style="width: 200px;"
        remote
        :remote-method="remoteMethod"
        class="filter-item"
        :loading="loading"
        @visible-change="visibleChange"
        @focus="homeworkFocus"
      >
        <el-option v-for="item in homeworkList" :key="item.id" :label="item.subjectName" :value="item.id" />
        <pagination v-show="homeworkTotal>0" :total="homeworkTotal" :page.sync="homeworkListQuery.current" :limit.sync="homeworkListQuery.size" @pagination="homeworkFetchData" />
      </el-select>
      <el-select v-model="listQuery.subjectTypeId" filterable placeholder="题型" clearable style="width: 200px;" class="filter-item">
        <el-option v-for="item in subjectTypes" :key="item.id" :label="item.typeName" :value="item.id" />
      </el-select>
      <el-input v-model="listQuery.auditUsername" placeholder="老师账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.auditNickname" placeholder="老师昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.repeatUsername" placeholder="审核人账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.repeatNickname" placeholder="审核人昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    </div>
    <div class="filter-container">
      <el-date-picker
        v-model="dateTiems"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 410px"
        align="right"
        class="filter-item"
        @change="dateTimeBinding"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        筛选
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="exportRepeat">
        导出
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
        重置
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
      <el-table-column align="center" label="题目名称" width="300">
        <template slot-scope="scope">
          {{ scope.row.groupName?(scope.row.groupName +"-"+scope.row.subjectName):scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学员账号" width="200">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="学员昵称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="subjectTypeName"
        label="题型"
      />
      <el-table-column label="老师账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditNickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业分数" align="center" width="150" prop="score" />
      <el-table-column label="审核人账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repeatUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repeatNickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="repeatTime"
        label="审核时间"
        align="center"
        width="200"
      />
      <el-table-column label="审核标签" align="center" prop="examineTag" :formatter="menuTypeFormat" />
      <el-table-column label="操作" align="center" width="100">
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
import { excelWriterRepeat } from '@/api/homework/hwHomework'
import { getRepeatFormList } from '@/api/homework/hwHomework'
import { gethwHomeworkList } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { getAllClass } from '@/api/homework/hwClass'
import { getHwSubjectTypeList } from '@/api/homework/subjectType'
// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'RepeatForm',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      homeworkListQuery: {
        current: 1,
        page: 100
      },
      homeworkList: [],
      homeworkTotal: 0,
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
      loading: false,
      listQuery: {
        current: 1,
        homeworkId: undefined,
        subjectTypeId: undefined,
        auditUsername: undefined,
        auditNickname: undefined,
        repeatUsername: undefined,
        repeatNickname: undefined,
        startTime: undefined,
        endTime: undefined
      },
      examineTags: []
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
    getHwSubjectTypeList().then(res => {
      if (res.success) {
        this.subjectTypes = res.data
      }
    })
    this.homeworkFetchData()
    this.examineTags = getDictDataList('hw_homework_examine_tag')
    this.fetchData()
  },
  methods: {
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
    visibleChange(val) {
      if (!val) {
        this.homeworkListQuery.current = 1
        this.homeworkList = []
      }
    },
    homeworkFocus(e) {
      this.homeworkFetchData()
    },
    remoteMethod(query) {
      this.homeworkListQuery.subjectName = query
      this.homeworkFetchData()
    },
    homeworkFetchData() {
      this.loading = true
      gethwHomeworkList(this.homeworkListQuery).then(response => {
        this.homeworkList = response.data.records
        this.homeworkTotal = parseInt(response.data.total)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.homeworkListQuery.limit = val
      this.homeworkFetchData()
    },
    handleCurrentChange(val) {
      this.homeworkListQuery.limit = val
      this.homeworkFetchData()
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
    },
    fetchData() {
      this.listLoading = true
      getRepeatFormList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    exportRepeat() {
      excelWriterRepeat(this.listQuery)
    },
    handleFilter() {
      this.listQuery.current = 1
      this.fetchData()
    },
    seeShare(url, id) {
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.open(routeUrl.href, '' + id)
    },
    resetListQuery() {
      this.listQuery = {
        current: 1,
        homeworkId: undefined,
        subjectTypeId: undefined,
        auditUsername: undefined,
        auditNickname: undefined,
        repeatUsername: undefined,
        repeatNickname: undefined,
        startTime: undefined,
        endTime: undefined
      }
      this.fetchData()
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
