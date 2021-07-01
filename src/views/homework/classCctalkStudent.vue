<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="星舟账号">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="星舟昵称" align="center">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cctalk用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cctalkUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="cctalk学籍号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cctalkStudentNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程数量" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="details(scope.row)"
          >查看详情</a>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getHwClassCctalkStudentPageList } from '@/api/homework/hwClass'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'ClassCctalkStudent',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.listQuery.id = this.$route.params.id
    this.fetchData()
  },
  methods: {
    details(row) {
      const url = '/classCctalk/cctalk/classCctalkStudent/student/details/' + row.id + '/' + this.listQuery.id
      this.$router.push(url)
    },
    fetchData() {
      this.listLoading = true
      getHwClassCctalkStudentPageList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    }
  }
}
</script>
