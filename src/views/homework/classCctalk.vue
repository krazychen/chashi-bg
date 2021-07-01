<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.className" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetTemp">
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
      <el-table-column align="center" label="班级名称">
        <template slot-scope="scope">
          {{ scope.row.className }}
        </template>
      </el-table-column>
      <el-table-column label="班级标签" align="center">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column label="班级人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已绑定cctalk人数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bindNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <a
            style="color: #1AFFED"
            @click="details(scope.row)"
          >详情</a>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>

import { getHwClassCctalkPageList } from '@/api/homework/hwClass'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'ClassCctalk',
  components: { Pagination },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return stateMap[state]
    },
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        className: undefined
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.fetchData()
  },
  methods: {
    details(row) {
      const url = '/classCctalk/cctalk/classCctalkStudent/classCctalkStudentForm/' + row.id
      this.$router.push(url)
    },
    fetchData() {
      this.listLoading = true
      getHwClassCctalkPageList(this.listQuery).then(response => {
        console.log(response.data)
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
      this.listQuery = {
        current: 1,
        className: undefined
      }
      this.fetchData()
    }
  }
}
</script>
