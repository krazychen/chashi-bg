<template>
  <div>
    <el-table :data="list" style="padding-top: 15px;">
      <el-table-column label="姓名"  align="center">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="学校"  align="center">
        <template slot-scope="scope">
          {{ scope.row.schoolName }}
        </template>
      </el-table-column>
      <el-table-column label="专业" width="250px" align="center">
        <template slot-scope="scope">
          {{ scope.row.collegeName }}
        </template>
      </el-table-column>
      <el-table-column label="分数"  align="center">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
      <el-table-column label="填报时间"  align="center">
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>

  <!--    <el-table-column label="填报数量" align="center">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>-->

</template>

<script>
import Pagination from '@/components/Pagination'
import { getStudentDetailsPageList } from '@/api/score/score'

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: this.lists,
      total: 0,
      listQuery: {
        current: 1,
        size: 15
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getStudentDetailsPageList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
      })
    }
  }
}
</script>
