<template>
  <div class="app-container">
    <div class="tag-group" style="margin-bottom: 10px;margin-top: 10px;">
      <el-tag
        v-for="(item,index) in items"
        :key="item.id"
        :type="yanse[item.yan]"
        size="medium"
        style="margin:10px"
        effect="dark"
        @click="refresh(item,items,index)"
      >
        {{ item.className+'(' +item.num+')' }}
      </el-tag>
    </div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" :row-class-name="tableRowClassName" @filter-change="fnFilterChangeInit">
      <!--<el-table-column fixed sortable prop="status" label="状态" width="100" :filters="filters" :filter-method="filterTag" filter-placement="bottom-end" column-key="statusList">--> <!--:filters="filters" :filter-method="filterTag" filter-placement="bottom-end"-->
      <el-table-column fixed sortable prop="status" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag :type="tagType(scope)" :effect="scope.row.auditState === '已批改' ? 'plain' : 'dark'" size="small" disable-transitions>{{ scope.row.auditState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed width="200px" label="题目">
        <template slot-scope="scope">
          {{ scope.row.groupName?(scope.row.groupName +"-"+scope.row.subjectName):scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column prop="subjectTypeName" sortable label="题型" :filters="subjectTypefilters" filter-placement="bottom-end" column-key="subjectTypeList" />
      <el-table-column prop="studentNumber" label="学号" align="center" />
      <el-table-column prop="nickname" width="150px" label="昵称" />
      <el-table-column prop="teacherName" width="150px" label="批改老师" />
      <el-table-column prop="className" width="200px" label="班级" />
      <el-table-column label="关联作业批改人" width="160">
        <template slot-scope="scope">
          {{ scope.row.relatedAuditUsername?scope.row.relatedAuditUsername+"（"+scope.row.relatedAuditNickname+'）':'-' }}
        </template>
      </el-table-column>
      <el-table-column prop="subTime" label="提交日期" width="140" />
      <el-table-column prop="auditEndTime" label="批改截止日期" width="140" />
      <el-table-column label="操作" width="245" fixed="right" align="center">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="listQuery.search"
            size="mini"
            placeholder="学号、昵称、关联批改人账号或昵称(回车触发)"
            @keyup.enter.native="huiche()"
          />
        </template>
        <template slot-scope="scope">
          <!--复评：排除以上两个状态，判断复评状态，为0的情况下可以进行复评-->
          <el-button type="primary" size="small" @click="seeShare('/system/'+scope.row.stuHomeworkId+'/showRepeatExamine/0',scope.row.stuHomeworkId+'reafp')">去查看</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="huiche()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

import { entrustRepeat, getEntrustReplyCount } from '@/api/homework/homework'
import { repeateInitial, getPageRepeatList } from '@/api/homework/hwHomework'
import { getHwSubjectTypeList } from '@/api/homework/homework'

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
  data() {
    return {
      shisha: 0,
      subjectTypefilters: [], // 老师所对应的所有题型
      indexyan: 0,
      total: 0,
      visible: false,
      drawer: false,
      activeIndex: 0,
      listQuery: {
        current: 1,
        classId: undefined,
        statusList: ['已批改', '待答复', '已答复'],
        repeatState: '0',
        search: undefined,
        subjectTypeList: []
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
        const subjectType = []
        res.data.forEach(function(a, b) {
          subjectType.push({ text: a.typeName, value: a.id })
        })
        this.subjectTypefilters = subjectType
      }
    })
    this.getListInitial()
  },
  methods: {
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
    getListInitial() {
      this.listLoading = true
      getEntrustReplyCount(this.listQuery).then(res => {
        repeateInitial(this.listQuery).then(response => {
          if (response.data != null) {
            this.tableData = response.data.list.records
            this.items = response.data.listClass
            if (this.items.length > 0) {
              this.listQuery.classId = this.items[0].id
            }
            this.items.forEach(function(a, b) {
              if (b === 0) {
                a.yan = 1
              } else {
                a.yan = 0
              }
            })
            const dd = { id: '##weituo', className: '委托班', num: res.data.num }
            this.items.push(dd)
            this.total = parseInt(response.data.list.total)
          }
          this.listLoading = false
        })
      })
    },
    getList() {
      this.listLoading = true
      getPageRepeatList(this.listQuery).then(response => {
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
