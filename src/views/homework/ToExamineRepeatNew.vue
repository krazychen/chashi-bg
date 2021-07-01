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
      <el-input v-model="listQuery.username" placeholder="老师账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.nickname" placeholder="老师昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.proportion" placeholder="审核比例小于  %" style="width: 200px;" class="filter-item" @input="inputnum()" @blur="check_count()" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        筛选
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
        重置
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="subjectName" label="作业名称" align="center" />
      <el-table-column prop="subjectTypeName" label="题型" align="center" />
      <el-table-column prop="username" label="一级老师账号" align="center" />
      <el-table-column prop="nickname" label="一级老师昵称" align="center" />
      <el-table-column prop="className" label="一级老师负责班级" align="center" />
      <el-table-column label="已批改数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.numAudit===null?0:scope.row.numAudit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已审核数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.numRepeat===null?0:scope.row.numRepeat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已审核比例" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.proportion===null?'0.00%':scope.row.proportion+'%' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="245" fixed="right" align="center">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="see(scope.row)"
          >详情</a>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="huiche()" />
    <el-dialog :visible.sync="dialogVisible" width="1280px" title="作业审核列表" @closed="closed">
      <div class="filter-container">
        <el-tag class="biaoqian" effect="plain" type="info">
          <div :class="subjectName.length>14?'haha':'hahas'">
            作业名称：{{ subjectName }}
          </div>
        </el-tag>
        <el-tag class="biaoqian" effect="plain" type="info">
          <div :class="nickname.length>14?'haha':'hahas'">
            老师账号：{{ nickname }}
          </div>
        </el-tag>
        <el-tag class="biaoqian" effect="plain" type="info">
          <div :class="username.length>14?'haha':'hahas'">
            老师昵称：{{ username }}
          </div>
        </el-tag>
      </div>
      <el-table v-loading="listOnlyLoading" :data="tableOnlyData" style="width: 100%" height="480px">
        <el-table-column label="学生学号" align="center" prop="studentNumber" />
        <el-table-column label="学生昵称" align="center" prop="nickname" />
        <el-table-column label="班级" align="center" prop="className" />
        <el-table-column label="学生作业分数" align="center" prop="score" />
        <el-table-column label="审核状态" align="center" prop="repeatState">
          <template slot-scope="scope">
            {{ scope.row.sort === 2?'已审核':'未审核' }}
          </template>
        </el-table-column>
        <el-table-column label="审核标签" align="center" prop="examineTag" :formatter="menuTypeFormat" />
        <el-table-column label="审核级老师账号" prop="repeatName" align="center" />
        <el-table-column label="审核老师昵称" prop="repeatNick" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a
              style="color: #1AFFED"
              @click="seeShare(scope.row)"
            >审核</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="onylTotal>0" :total="onylTotal" :page.sync="onlyListQuery.current" :limit.sync="onlyListQuery.size" @pagination="see()" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

import waves from '@/directive/waves'
import { entrustRepeat } from '@/api/homework/homework'
import { getPageRepeatListOnly, getPageRepeatListNew, getRepeatJudge, getRepeatPageList } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/homework'
import { getDictDataList } from '@/utils/dictUtils'

const mapping = {
  '待批改': 'warning',
  '待答复': '',
  '已批改': 'success',
  '批改超期': 'info',
  '批改超期已审核': '',
  '已答复': ''
}

export default {
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      homeworkListQuery: {
        current: 1,
        page: 100
      },
      subjectTypes: [],
      homeworkList: [],
      homeworkTotal: 0,
      loading: false,
      examineTags: [],
      tableOnlyData: [],
      listOnlyLoading: false,
      dialogVisible: false,
      username: '',
      subjectName: '',
      nickname: '',
      shisha: 0,
      subjectTypefilters: [], // 老师所对应的所有题型
      indexyan: 0,
      total: 0,
      onylTotal: 0,
      visible: false,
      drawer: false,
      activeIndex: 0,
      onlyListQuery: {
        current: 1,
        id: undefined
      },
      listQuery: {
        current: 1,
        homeworkId: undefined,
        subjectTypeId: undefined,
        username: undefined,
        nickname: undefined,
        proportion: undefined
      },
      listLoading: false,
      items: undefined,
      activeName: 'first',
      yanse: ['', 'success', 'info', 'danger', 'warning'],
      filters: [
        { text: '待批改', value: '待批改' },
        { text: '已批改', value: '已批改' },
        { text: '批改超期', value: '批改超期' },
        { text: '批改超期已审核', value: '批改超期已审核' },
        { text: '待答复', value: '待答复' },
        { text: '已答复', value: '已答复' }
      ],
      tableData: null
    }
  },
  created() {
    getHwSubjectTypeList().then(res => {
      if (res.success) {
        this.subjectTypes = res.data
      }
    })
    this.examineTags = getDictDataList('hw_homework_examine_tag')
    this.getList()
  },
  methods: {
    resetListQuery() {
      this.listQuery = {
        current: 1,
        homeworkId: undefined,
        subjectTypeId: undefined,
        username: undefined,
        nickname: undefined,
        proportion: undefined
      }
      this.getList()
    },
    check_count() {
      if (this.listQuery.proportion <= 0) {
        this.$message.error('请输入大于0的数字，支持输入2位小数')
        this.listQuery.proportion = ''
      }
    },
    inputnum() {
      this.listQuery.proportion = this.inputnums()
    },
    inputnums() {
      const val = this.listQuery.proportion
      let num = val.replace(/[^\d.]/g, '') // 清除"数字"和"."以外的字符
      num = num.replace(/^\./g, '') // 验证第一个字符是数字
      if (num.indexOf('.') === -1) { // 小数点前留9位
        if (num.length > 9) {
          num = num.slice(0, 9)
        }
      } else {
        if (num.split('.')[0].length > 9) {
          num = num.split('.')[0].slice(0, 9) + '.' + num.split('.')[1]
        }
      }
      num = num.replace(/\.{2,}/g, '') // 只保留第一个, 清除多余的
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') // 只能输入两个小数
      return num
    },
    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },
    homeworkFocus(e) {
      this.homeworkFetchData()
    },
    visibleChange(val) {
      if (!val) {
        this.homeworkListQuery.current = 1
        this.homeworkList = []
      }
    },
    remoteMethod(query) {
      this.homeworkListQuery.subjectName = query
      this.homeworkFetchData()
    },
    homeworkFetchData() {
      this.loading = true
      getRepeatPageList(this.homeworkListQuery).then(response => {
        this.homeworkList = response.data.records
        this.homeworkTotal = parseInt(response.data.total)
        this.loading = false
      })
    },
    seeShare(row) {
      const id = row.id
      getRepeatJudge(id).then(res => {
        let url = '/system/' + id + '/showRepeatExamine/0'
        if (res.success && res.data != null) {
          if (res.data === 2) {
            url = '/system/' + id + '/repeatDetails/0'
          }
          const routeUrl = this.$router.resolve({
            path: url
          })
          window.open(routeUrl.href, '' + id)
        } else {
          url = '/system/' + id + '/formView/0'

          // 判断是否拥有审核权限，有则审核，无则详情
          const routeUrl = this.$router.resolve({
            path: url
          })
          window.open(routeUrl.href, '' + id)
        }
      })
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
    refresh(item, items, index) {
      this.listQuery.current = 1
      if (item.id === '##weituo') {
        this.shisha = 1
        this.listQuery.classId = undefined
        this.getEntrustList()
      } else {
        this.shisha = 0
        this.listQuery.classId = item.id
        this.getList()
      }
      items[index].yan = 1
      items[this.indexyan].yan = 0
      this.indexyan = index
    },
    closed() {
      this.subjectName = ''
      this.username = ''
      this.nickname = ''
      this.tableOnlyData = []
      this.onylTotal = 0
      this.onlyListQuery = {
        current: 1,
        id: undefined
      }
    },
    see(row) {
      if (row) {
        this.username = row.username
        this.nickname = row.nickname
        this.subjectName = row.subjectName
        this.onlyListQuery.id = row.auditTeacherId
        this.onlyListQuery.homeworkId = row.id
      }
      this.listOnlyLoading = true
      this.dialogVisible = true
      getPageRepeatListOnly(this.onlyListQuery).then(res => {
        this.tableOnlyData = res.data.records
        this.onylTotal = parseInt(res.data.total)
        this.listOnlyLoading = false
      })
    },
    huiche() {
      if (this.shisha === 0) {
        this.getList()
      } else {
        this.getEntrustList()
      }
    },
    zhuiwen(stuHomeworkId) {
      this.$router.push({ path: '/homework/assignments/show', query: { stu: 0, id: stuHomeworkId }})
    },
    getList() {
      this.listLoading = true
      getPageRepeatListNew(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    getEntrustList() {
      this.listLoading = true
      entrustRepeat(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    filterTag(value, row) {
      return true
    },
    tagType({ row, rowIndex }) {
      return mapping[row.auditState]
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === '待批改') {
        return 'warning-row'
        // } else if (rowIndex === 3) {
        //   return 'success-row';
      }
      return ''
    },
    fnFilterChangeInit(filter) {
      if (filter.statusList) {
        this.listQuery.statusList = filter.statusList
        this.huiche()
      }
      if (filter.subjectTypeList) {
        this.listQuery.subjectTypeList = filter.subjectTypeList
        this.huiche()
      }
    }
  }
}
</script>

<style>
  .el-table__body{
    width: 100%;
    table-layout: fixed !important;
  }
  .extra {
    color: #999;
    font-size: small;
    margin-top: .5em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-table .cell {
    overflow: initial;
  }
  .el-badge__content {
    line-height: 16px;
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-tooltip__popper {
    width: 400px;
  }
  .el-tooltip__popper.is-light {
    background: oldlace;
  }
</style>

<style scoped>

  .haha {
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 1.5em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

  .hahas {
    text-align: center;
    float: left;
    margin-top: 1em;
    margin-bottom: 1em;
    height: 1.5em;
    line-height: 1em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }

  /deep/ .biaoqian.el-tag--small {

    padding: 0 8px;
    line-height: 1em;
    font-size: 18px;
    min-height: 3em;
    margin-right: 1em;
    margin-bottom: 1em;
  }
</style>
