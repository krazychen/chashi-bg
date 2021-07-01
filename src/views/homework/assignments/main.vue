<template>
  <div>
    <div class="tag-group" style="margin-bottom: 10px;margin-top: 10px;">
      <el-tag
        v-for="(item,index) in filtersSubjectType"
        :key="item.id"
        :type="yanse[item.yan]"
        size="medium"
        style="margin:10px"
        effect="dark"
        @click="refresh(item,filtersSubjectType,index)"
      >
        {{ item.subjectTypeName+'(' +item.num+')' }}
      </el-tag>
    </div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" :row-class-name="tableRowClassName" @filter-change="fnFilterChangeInit">
      <el-table-column prop="status" label="状态" width="100" :filters="filters" :filter-method="filterTag" filter-placement="bottom-end" column-key="statusList" sortable> <!--:filters="filters" :filter-method="filterTag" filter-placement="bottom-end"-->
        <template slot-scope="scope">
          <el-tag :type="tagType(scope)" :effect="scope.row.status === '已提交' ? 'plain' : 'dark'" size="small" disable-transitions>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="作业名称" style="width: 400px" sortable>
        <template slot-scope="scope">
          <!--          <a v-if="scope.row.subState === '1' && new Date().getTime()<new Date(scope.row.endTime).getTime()" @click="seeShare('/homework/'+scope.row.stuHomeworkId+'/studentView/'+0,scope.row.stuHomeworkId)">{{ scope.row.subjectName }}</a>
          <a v-else-if="scope.row.subState === '2' || new Date().getTime()>=new Date(scope.row.endTime).getTime()" @click="seeShare('/homework/'+scope.row.stuHomeworkId+'/studetails/'+0,scope.row.stuHomeworkId+'chakan')">{{ scope.row.subjectName }}</a>
          <a v-else>{{ scope.row.subjectName }}</a>-->
          <a>{{ scope.row.groupName?(scope.row.groupName +"-"+scope.row.subjectName): scope.row.subjectName }}</a>
          <el-tooltip class="item" effect="light" :content="unescape(scope.row.completeExplain)" placement="top">
            <span>
              <div v-if="scope.row.completeExplain" class="extra">
                {{ unescape(scope.row.completeExplain) }}
              </div>
            </span>
          </el-tooltip>
          <div v-if="scope.row.subTime" class="extra">提交日期： {{ scope.row.subTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="分数" align="center">
        <template slot-scope="scope">
          {{ scope.row.score?scope.row.score:'-' }}
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="subjectTypeName" label="题型" width="140" :filters="filtersSubjectType" :filter-method="filterTagSubjectType" filter-placement="bottom-end" column-key="subjectTypes" sortable /> &lt;!&ndash;:filters="filters" :filter-method="filterTag" filter-placement="bottom-end"&ndash;&gt;
-->
      <el-table-column prop="subjectTime" label="发布时间" sortable width="140" />
      <el-table-column prop="endTime" label="截止日期" sortable width="140" />
      <el-table-column prop="questions" label="操作" width="80" sortable fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == '未开始' || scope.row.status == '已提交' || scope.row.status == '已批改'|| scope.row.status == '已结束'|| scope.row.status == '已追问'|| scope.row.status == '已答复'" type="primary" size="small" @click="seeShare('/homework/'+scope.row.stuHomeworkId+'/studetails/'+0,scope.row.stuHomeworkId+'chakan')">去查看</el-button>
          <el-button v-else type="primary" size="small" @click="seeShare('/homework/'+scope.row.stuHomeworkId+'/studentView/'+0,scope.row.stuHomeworkId)">去查看</el-button>
          <!--          <el-badge v-if="scope.row.new_answer" value="new">
            <el-button size="small">{{ scope.row.qaNumber }}</el-button>
          </el-badge>
          <el-button v-else-if="scope.row.qaNumber > 0" size="small">{{ scope.row.qaNumber }}</el-button>
          <el-button v-if="scope.row.qaNumber == 0" type="primary" size="small" @click="zhuiwen(scope.row.stuHomeworkId)">追问</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

import { getStuHomeworkList } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList, getStudentHwSubjectTypeList } from '@/api/homework/homework'
const mapping = {
  '新作业': 'warning',
  '未开始': '',
  '待提交': '',
  '已提交': 'success',
  '已结束': 'info',
  '已批改': '',
  '已追问': '',
  '已答复': ''
}

export default {
  components: { Pagination },
  data() {
    return {
      indexyan: 0,
      yanse: ['', 'success', 'info', 'danger', 'warning'],
      total: 0,
      visible: false,
      drawer: false,
      activeIndex: 0,
      listQuery: {
        current: 1,
        status: [],
        subjectTypes: []
      },
      activeName: 'first',
      filters: [
        { text: '新作业', value: '新作业' },
        { text: '未开始', value: '未开始' },
        { text: '待提交', value: '待提交' },
        { text: '已提交', value: '已提交' },
        { text: '已结束', value: '已结束' },
        { text: '已批改', value: '已批改' },
        { text: '已追问', value: '已追问' },
        { text: '已答复', value: '已答复' }
      ],
      filtersSubjectType: [],
      tableData: null,
      listLoading: false
    }
  },
  created() {
    getStudentHwSubjectTypeList().then(res => {
      if (res.success) {
        const subjectType = []
        /*        res.data.forEach(function(a, b) {
          subjectType.push({ text: a.typeName, value: a.id })
        })*/
        res.data.forEach(function(a, b) {
          let yan = 0
          if (b === 0) {
            yan = 1
          }
          subjectType.push({ subjectTypeName: a.subjectTypeName, id: a.subjectTypeId, yan: yan, num: a.num })
        })
        this.filtersSubjectType = subjectType
        this.listQuery.subjectTypes.push(this.filtersSubjectType[0].id)
        this.getList()
      }
    })
  },
  methods: {
    refresh(item, items, index) {
      this.listQuery.current = 1
      this.listQuery.subjectTypes = []
      this.listQuery.subjectTypes.push(item.id)
      this.getList()
      items[index].yan = 1
      items[this.indexyan].yan = 0
      this.indexyan = index
    },
    unescape(html) {
      if (!html) {
        return ''
      }
      return html
        .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/amp;/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "\'")
        .replace(/&ldquo;/g, '\“')
        .replace(/&rdquo;/g, '\”')
        .replace(/&lsquo;/g, '\‘')
        .replace(/&rsquo;/g, '\’')
    },
    zhuiwen(stuHomeworkId) {
      this.$router.push({ path: '/homework/' + stuHomeworkId + '/studetails/' + 0 })
    },
    getList() {
      this.listLoading = true
      getStuHomeworkList(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    filterTag(value, row, column) {
      return true
    },
    filterTagSubjectType(value, row, column) {
      return true
    },
    tagType({ row, rowIndex }) {
      return mapping[row.status]
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.status === '新作业') {
        return 'warning-row'
      // } else if (rowIndex === 3) {
      //   return 'success-row';
      }
      return ''
    },
    fnFilterChangeInit(filter) {
      // debugger
      if (filter.statusList) {
        this.listQuery.statusList = filter.statusList
      }
      if (filter.subjectTypes) {
        this.listQuery.subjectTypes = filter.subjectTypes
        console.log('进来了')
      }
      this.getList()
    },
    seeShare(url, id) {
      const routeUrl = this.$router.resolve({
        path: url
      })
      window.open(routeUrl.href, '' + id)
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
