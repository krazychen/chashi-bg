<template>
  <div class="app-container">
    <div class="filter-container">

      <el-tag class="biaoqian" effect="dark">
        <div :class="username.length>14?'haha':'hahas'">
          老师账号：{{ username }}
        </div>
      </el-tag>

      <el-tag class="biaoqian" effect="dark">
        <div :class="nickname.length>14?'haha':'hahas'">
          老师昵称： {{ nickname }}
        </div>
      </el-tag>
      <el-tag class="biaoqian" effect="dark">
        <div :class="subjectName.length>14?'haha':'hahas'">
          作业名称： {{ subjectName }}
        </div>
      </el-tag>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      height="400px"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="学生学号">
        <template slot-scope="scope">
          {{ scope.row.studentNumber }}
        </template>
      </el-table-column>
      <el-table-column label="学生昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生作业状态" align="center" width="150" prop="subState" :formatter="menuTypeFormat" />
      <el-table-column label="学生作业分数" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.score }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="seeShare(urls,scope.row)"
          >详情</a>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getTeacherFormClassInfoList } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'TeacherFormClassInfo',
  components: { Pagination },
  directives: { waves },
  props: {
    url: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      subStates: [],
      dateTiems: [],
      urls: this.url,
      username: '',
      nickname: '',
      subjectName: '',
      subjectTypes: [],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        teacherId: undefined,
        homeworkId: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.subStates = getDictDataList('hw_homework_submit_status')
  },
  methods: {
    seeShare(urls, row) {
      if (!row.id) {
        this.$message.error('无法查看详情，原因可能是此学员不存在于任何班级中！')
        return false
      }
      let houtzhui = 'form'
      let url = '/system/homework/' + row.id + '/formView/0'
      if (urls === '1') {
        url = '/homework/' + row.id + '/details/0'
        houtzhui = 'tea'
      }
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.open(routeUrl.href, '' + row.id + houtzhui)
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
    fetchDataStart(row) {
      this.username = row.username
      this.nickname = row.nickname ? row.nickname : '暂无昵称'
      this.subjectName = row.subjectName
      this.listQuery.teacherId = row.teacherId
      this.listQuery.homeworkId = row.homeworkId
      this.fetchData()
    },
    restListQuery() {
      this.listQuery = {
        current: 1,
        size: 10,
        teacherId: undefined,
        homeworkId: undefined
      }
      this.subjectName = ''
      this.list = []
    },
    fetchData() {
      this.listLoading = true
      getTeacherFormClassInfoList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
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
