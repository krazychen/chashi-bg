<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.subjectName" placeholder="作业名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.jobTag" placeholder="作业标签" clearable style="width: 200px;" class="filter-item">
        <el-option v-for="item in jobTags" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        筛选
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
      <el-table-column align="center" label="题型" width="150">
        <template slot-scope="scope">
          {{ scope.row.subjectTypeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="学员学号" width="200">
        <template slot-scope="scope">
          {{ scope.row.studentNumber }}
        </template>
      </el-table-column>
      <el-table-column label="学员昵称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业状态" align="center" width="150" prop="subState" :formatter="menuTypeFormat" />
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
      <el-table-column label="作业分数" align="center" width="150" prop="score" />
      <el-table-column label="作业标签" align="center" prop="jobTag" :formatter="menuTypeFormat"/>
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
import { getClassTypeFormList } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { getHwClassTypeAll } from '@/api/homework/hwClassType'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'ClassTypForm',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      jobTags: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        subjectName: undefined,
        jobTag: undefined
      },
      subStates: []
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.jobTags = getDictDataList('hw_homework_job_tag')
    this.subStates = getDictDataList('hw_homework_submit_status')
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
    fetchData() {
      this.listLoading = true
      getClassTypeFormList(this.listQuery).then(response => {
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
    seeShare(url, id) {
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.open(routeUrl.href, '' + id)
    },
    resetListQuery() {
      this.listQuery = {
        current: 1,
        subjectName: undefined,
        jobTag: undefined
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
