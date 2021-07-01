<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="13" :sm="15" :md="16" :lg="18">
        <div class="filter-container">
          <el-input v-model="listQuery.userName" placeholder="cctalk用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.studentNo" placeholder="cctalk学籍号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.groupId" placeholder="cctalk群号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        </div>
        <div class="filter-container">
          <el-input v-model="listQuery.orderId" placeholder="cctalk订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.username" placeholder="星舟账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.isRefund" placeholder="是否退课" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in isRefunds" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>

        </div>
      </el-col>
      <el-col
        :xs="11"
        :sm="9"
        :md="8"
        :lg="6"
        style="text-align: center;text-align: center;font-size: 12px;font-weight: 500;line-height: 23px"
      >
        <i class="el-icon-time" />&nbsp;&nbsp;&nbsp;最近一次更新时间为：<span>{{ updateTime }}</span>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="cctalk用户名">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="cctalk学籍号" align="center">
        <template slot-scope="scope">
          {{ scope.row.studentNo }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="群名称" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="群号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dealFee }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="支付时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billDate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="退款金额" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.refundCash }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="关联星舟账号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="isRefund" label="是否退课" :formatter="menuTypeFormat" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

  </div>
</template>

<script>
import { getPageList, getLatelyUpdateTime } from '@/api/homework/cctalk.js'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'Cctalk',
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
      updateTime: undefined,
      listQuery: {
        current: 1,
        userName: undefined,
        orderId: undefined,
        studentNo: undefined,
        groupId: undefined,
        username: undefined,
        isRefund: undefined
      },
      isRefunds: []
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.isRefunds = getDictDataList('sys_yes_no')
    this.fetchData()
  },
  methods: {
    getUpdateTime() {
      getLatelyUpdateTime().then(res => {
        if (res.success) {
          this.updateTime = res.data
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getPageList(this.listQuery).then(response => {
        this.getUpdateTime()
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const typ = this[type.property + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row[type.property]) {
          vv = aa.dictLabel
        }
      })
      return vv
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
