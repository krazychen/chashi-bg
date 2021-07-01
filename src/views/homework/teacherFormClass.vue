<template>
  <div class="app-container">
    <div class="filter-container">

      <el-tag v-if="this.listQuery.currentTeacher === '0' " class="biaoqian" effect="dark">
        <div :class="username.length>14?'haha':'hahas'">
          老师账号：{{ username }}
        </div>
      </el-tag>
      <el-tag v-else effect="dark" style="margin: 10px;font-size: 17px;">
        老师账号：{{ username }}
      </el-tag>

      <el-tag v-if="this.listQuery.currentTeacher === '0' " class="biaoqian" effect="dark">
        <div :class="nickname.length>14?'haha':'hahas'">
          老师昵称： {{ nickname }}
        </div>
      </el-tag>
      <el-tag v-else effect="dark" type="success" style="margin: 10px;font-size: 17px;">
        老师昵称： {{ nickname }}
      </el-tag>

      <el-tag v-if="this.listQuery.currentTeacher === '0' " class="biaoqian" effect="dark">
        <div class="hahas">
          总批改量：{{ allCount }}
        </div>
      </el-tag>
      <el-tag v-else effect="dark" type="info" style="margin: 10px;font-size: 17px;">
        总批改量：{{ allCount }}
      </el-tag>

      <el-tag v-if="this.listQuery.currentTeacher === '0' " class="biaoqian" effect="dark">
        <div class="hahas">
          最近两周批改量：{{ twoWeeksCount }}
        </div>
      </el-tag>
      <el-tag v-else effect="dark" type="success" style="margin: 10px;font-size: 17px;">
        最近两周批改量：{{ twoWeeksCount }}
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
      <el-table-column align="center" label="作业名称">
        <template slot-scope="scope">
          {{ scope.row.groupName?(scope.row.groupName +"-"+scope.row.subjectName):scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column label="作业题型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subjectTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老师批改数量" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.allCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="此次作业给与平均分" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <a style="color: #1AFFED" @click="operation(scope.row)">详情</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="作业给分列表" :visible.sync="dialogFormVisible" width="1024px" @opened="operationOpen" @close="restZi">
      <teacher-form-class-info ref="child" :url="urls" />
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getTeacherFormClass } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import teacherFormClassInfo from './teacherFormClassInfo'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'TeacherFormClass',
  components: { Pagination, teacherFormClassInfo },
  directives: { waves },
  props: {
    currentTeacher: {
      type: String,
      default: '0'
    },
    url: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      row: {},
      urls: '0',
      dateTiems: [],
      allCount: '',
      twoWeeksCount: '',
      username: '',
      nickname: '',
      teacherId: undefined,
      subjectTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        id: undefined,
        currentTeacher: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    const row = this.$route.query.row
    this.username = row.username
    this.nickname = row.nickname ? row.nickname : '暂无昵称'
    this.allCount = row.allCount
    this.twoWeeksCount = row.twoWeeksCount
    this.listQuery.id = row.id
    this.teacherId = row.id
    this.listQuery.currentTeacher = this.currentTeacher
    this.urls = this.url
    this.row = { username: this.username, nickname: this.nickname, allCount: this.allCount, teacherId: this.teacherId }
    this.fetchData()
  },
  methods: {
    restZi() {
      this.$refs.child.restListQuery()
    },
    operationOpen() {
      this.$refs.child.fetchDataStart(this.row)
    },
    operation(rows) {
      this.dialogFormVisible = true
      this.row.homeworkId = rows.id
      this.row.subjectName = rows.subjectName
    },
    fetchData() {
      this.listLoading = true
      getTeacherFormClass(this.listQuery).then(response => {
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
  /deep/ .biaoqian.el-tag--small {

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
