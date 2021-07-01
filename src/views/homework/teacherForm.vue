<template>
  <div class="app-container">
    <div v-if="this.listQuery.currentTeacher === '0'" class="filter-container">
      <el-select
        v-model="listQuery.classId"
        placeholder="班级"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in classs" :key="item.id" :label="item.className" :value="item.id" />
      </el-select>
      <el-select
        v-model="listQuery.typeId"
        placeholder="题型"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in subjectTypes" :key="item.id" :label="item.typeName" :value="item.id" />
      </el-select>
      <el-input v-model="listQuery.username" placeholder="老师账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.nickname" placeholder="老师昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <el-table-column align="center" label="老师账号" width="200" fixed>
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="老师昵称" width="200">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="题型" width="200">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="老师负责班级" width="400">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.className" placement="top">
            <div v-if="scope.row.className" class="extra">
              {{ scope.row.className }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="总的作业批改数量" width="200">
        <template slot-scope="scope">
          {{ scope.row.allCount }}
        </template>
      </el-table-column>
      <el-table-column label="近两周作业批改数量" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.twoWeeksCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="seeShare(scope.row)"
          >详情</a>
          <!--<a ref="/homework/reportForm/class" style="color: #1AFFED">详情</a>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getTeacherFormList } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/subjectType'
import { getAllClass } from '@/api/homework/hwClass'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'TeacherForm',
  components: { Pagination },
  directives: { waves },
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
      subjectTypes: [],
      classs: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        username: undefined,
        nickname: undefined,
        classId: undefined,
        typeId: undefined,
        currentTeacher: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.listQuery.currentTeacher = this.currentTeacher
    if (this.listQuery.currentTeacher === '0') {
      getHwSubjectTypeList().then(res => {
        if (res.success) {
          this.subjectTypes = res.data
        }
      })
      getAllClass().then(res => {
        if (res.success) {
          this.classs = res.data
        }
      })
    }
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
      getTeacherFormList(this.listQuery).then(response => {
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
    seeShare(row) {
      this.viewDetails(row)
    },
    resetListQuery() {
      this.listQuery = {
        current: 1,
        username: undefined,
        nickname: undefined,
        classId: undefined,
        typeId: undefined
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
<style>
  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>
