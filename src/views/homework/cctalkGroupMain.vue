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
        {{ item.groupName+'(' +item.passRate+'%)' }}
      </el-tag>
    </div>
    <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column prop="videoName" label="节目名称" />
      <el-table-column prop="videoDuration" label="节目时长" align="center" :formatter="formats" />
      <el-table-column prop="liveWatchDuration" label="节目观看时长" align="center" :formatter="formats" />
      <el-table-column prop="reviewWatchDuration" label="回顾观看时长" align="center" :formatter="formats" />
      <el-table-column prop="state" label="是否完成" align="center">
        <template slot-scope="scope">
          {{ scope.row.state === '1'?'是':'否' }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="huiche()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

import { getAllStudentGroup, getVideoPageList } from '@/api/homework/cctalk'
export default {
  components: { Pagination },
  data() {
    return {
      shisha: 0,
      indexyan: 0,
      total: 0,
      listQuery: {
        current: 1,
        groupId: undefined,
        id: undefined
      },
      listLoading: false,
      items: undefined,
      yanse: ['', 'success', 'info', 'danger', 'warning'],
      tableData: []
    }
  },
  created() {
    this.listQuery.id = this.$route.params.id
    const length = this.$router.history.current.matched.length
    let url = this.$router.history.current.matched[length - 2].parent.redirect
    url = url.substring(0, url.lastIndexOf('/')) + '/' + this.$route.params.classId
    this.$router.history.current.matched[3].parent.redirect = url
    this.getGroupList(this.listQuery.id)
  },
  methods: {
    formats(row, type) {
      const m = row[type.property]
      return this.getStringTime(m)
    },
    getStringTime(m) {
      const mss = m * 60 * 1000
      const hours = Math.floor(mss / (1000 * 60 * 60))
      const minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60))
      return hours + '小时' + minutes + '分钟'
    },
    refresh(item, items, index) {
      this.listQuery.current = 1
      this.shisha = 0
      this.listQuery.groupId = item.id
      this.getList()
      items[index].yan = 1
      items[this.indexyan].yan = 0
      this.indexyan = index
    },
    getGroupList(id) {
      getAllStudentGroup(id).then(response => {
        if (response.success) {
          this.items = response.data
          this.getList()
        }
      })
    },
    getList() {
      if (!this.listQuery.groupId) {
        if (this.items.length > 0) {
          this.listQuery.groupId = this.items[0].id
        } else {
          return false
        }
      }
      this.listLoading = true
      getVideoPageList(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
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
