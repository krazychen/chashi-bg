<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listRefQuery.userName" placeholder="请输入cctalk用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listRefQuery.name" placeholder="请输入星舟账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listRefQuery.refUserName" placeholder="请输入课程顾问" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="restHandleFilter">
          重置
        </el-button>
        <el-dropdown class="filter-item" trigger="click">
          <el-button type="primary" class="el-dropdown-link">
            更多
            <i class="el-icon-caret-bottom" />
          </el-button>
          <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button v-waves class="filter-item" type="primary" @click="registerOrder">
                登记退课
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
        v-loading="listRefLoading"
        :data="listRef"
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
        <el-table-column label="关联订单" align="center">
          <template slot-scope="scope">
            {{ scope.row.salesOrderId?scope.row.salesOrderId.replace(",","；"):"-" }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="关联订单金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dealFee?scope.row.dealFee.replace(",","；"):"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" align="center" label="关联订单支付时间">
          <template slot-scope="scope">
            <span>{{ scope.row.billDate?scope.row.billDate.replace(",","；"):"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="星舟账号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="退课费用" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refMoney }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="unescape(scope.row.remarks)" placement="top">
              <div v-if="scope.row.remarks" class="extra">
                {{ unescape(scope.row.remarks) }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="课程顾问" prop="refUserName" />
        <el-table-column label="登记时间" prop="refTime" />
      </el-table>
      <pagination v-show="refTotal>0" :total="refTotal" :page.sync="listRefQuery.current" :limit.sync="listRefQuery.size" @pagination="fetchRegData" />
    </div>
    <el-dialog :visible.sync="dialogFormVisible" width="810px" @closed="closed">
      <div v-show="number===1">
        <div class="filter-container">
          <el-autocomplete v-model="listQuery.userName" placeholder="请输入用户名" :fetch-suggestions="querySearch" :trigger-on-focus="false" style="width: 200px;" class="filter-item" @select="handleSelect" />
        </div>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          height="230"
          style="width: 100%;"
          :row-key="getKey"
          @selection-change="handleSelectionChange"
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
              <span>{{ unescape(scope.row.groupName) }}</span>
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
          <el-table-column
            class-name="status-col"
            label="关联此订单"
            type="selection"
            width="55"
            :reserve-selection="true"
            :selectable="checkSelectable"
          />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
      </div>

      <el-form v-show="number===2" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 680px; height: 280px; margin-left:50px;">
        <el-form-item label="退课费用" prop="refMoney">
          <el-input v-model="temp.refMoney" placeholder="请输入退课费用" />
        </el-form-item>
        <el-form-item label="备注" prop="phone">
          <el-input v-model="temp.remarks" type="textarea" maxlength="100" show-word-limit :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="next()">
          {{ number === 1?'下一步':'上一步' }}
        </el-button>
        <el-button v-show="number===2" type="primary" @click="determine">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, addCctalkSalesOrderRef, getCctalkSalesOrderRefPageList, getCandidateList, checkExistence } from '@/api/homework/cctalk.js'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { unEscape } from '@/utils/index'

export default {
  name: 'CctalkReg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      multipleSelection: [],
      isUser: true,
      rules: {
        refMoney: [{ required: true, message: '请输入退款金额', trigger: 'blur' }, { validator: this.validatorCashBack }]
      },
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      number: 1,
      temp: {
        id: undefined,
        studentNo: undefined,
        refMoney: '',
        remarks: undefined,
        salesOrderId: undefined
      },
      total: 0,
      refTotal: 0,
      regTypes: [],
      listRef: [],
      listRefLoading: true,
      listRefQuery: {
        current: 1,
        refUserName: undefined,
        userName: undefined,
        name: undefined
      },
      listQuery: {
        current: 1,
        userName: undefined
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '150px'
      }
    }
  },
  created() {
    this.listRefLoading = false
    this.regTypes = getDictDataList('cctalk_sales_order_reg_type')
    this.fetchRegData()
  },
  methods: {
    checkSelectable(row) {
      return row.isRef === '0'
    },
    unescape(html) {
      return unEscape(html)
    },
    handleSelect() {
      this.reset()
      this.fetchData()
    },
    reset() {
      this.$refs.multipleTable.clearSelection()
      this.temp = {
        id: undefined,
        studentNo: undefined,
        refMoney: '',
        remarks: undefined,
        salesOrderId: undefined
      }
    },
    querySearch(queryString, cb) {
      getCandidateList(this.listQuery).then(res => {
        if (res.success) {
          cb(res.data)
        }
      })
    },
    registerOrder() {
      this.dialogFormVisible = true
    },
    closed() {
      this.number = 1
      this.listQuery = {
        current: 1,
        orderId: undefined,
        studentNo: undefined,
        userName: undefined,
        searchType: 0
      }
      this.list = []
      this.temp = {
        id: undefined,
        studentNo: undefined,
        refMoney: '',
        remarks: undefined,
        salesOrderId: undefined
      }
    },
    determine() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = []
          this.multipleSelection.forEach(function(a) {
            data.push({ studentNo: a.studentNo, refMoney: that.temp.refMoney, remarks: that.temp.remarks, salesOrderId: a.orderId })
          })
          addCctalkSalesOrderRef(data).then(res => {
            if (res.success && res.data != null && res.data) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.fetchRegData()
            } else {
              this.$notify({
                title: '失败',
                message: res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    validatorCashBack(rule, value, callback) {
      const regs = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (value.length === 0) {
        callback()
      } else {
        if (!regs.test(value)) {
          callback([new Error('输入的返现金额不合法')])
        } else {
          callback()
        }
      }
    },
    getKey(row) {
      return row.id
    },
    selectAll(vals) {
      console.log(vals)
    },
    handleSelectionChange(val) {
      /*      if (val.length > 1) {
        const vals = [val[0]]
        this.multipleSelection = vals
        this.toggleSelection(this.multipleSelection)
        return false
      }*/
      this.multipleSelection = val
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleFilter() {
      this.listRefQuery.page = 1
      this.fetchRegData()
    },
    restHandleFilter() {
      this.listRefQuery.page = 1
      this.listRefQuery = {
        current: 1,
        refUserName: undefined,
        userName: undefined,
        name: undefined
      }
      this.fetchRegData()
    },
    fetchRegData() {
      this.listRefLoading = true
      getCctalkSalesOrderRefPageList(this.listRefQuery).then(response => {
        if (response.success) {
          this.listRef = response.data.records
          this.refTotal = parseInt(response.data.total)
          this.listRefLoading = false
        }
      })
    },
    fetchData() {
      this.listLoading = true
      getPageList(this.listQuery).then(response => {
        if (response.success) {
          this.list = response.data.records
          this.total = parseInt(response.data.total)
          this.listLoading = false
        }
      })
    },
    searchTypeChange(val) {
      if (val === 0) {
        this.listQuery.userName = undefined
        this.listQuery.studentNo = undefined
      } else if (val === 1) {
        this.listQuery.orderId = undefined
        this.listQuery.userName = undefined
      } else {
        this.listQuery.studentNo = undefined
        this.listQuery.orderId = undefined
      }
    },
    addStudentClass() {
      const addStudentClassObj = {
        id: null,
        classId: null,
        studentId: this.editStudentId,
        studentNumber: null
      }
      this.temp.studentClassList.push(addStudentClassObj)
      this.$nextTick(() => {
        this.setScrollTop()
      })
    },
    setScrollTop() {
      const cc = document.querySelector('.llla')
      cc.scrollTop = cc.scrollHeight
    },
    deleteStudentClass(item) {
      const index = this.temp.studentClassList.indexOf(item)
      if (index !== -1) {
        this.temp.studentClassList.splice(index, 1)
        this.$nextTick(() => {
          this.setScrollTop()
        })
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          /*          createUser(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })*/
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          /*          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })*/
        }
      })
    },
    next() {
      const that = this
      if (this.number === 1) {
        if (this.multipleSelection.length < 1) {
          this.$message.error('请至少选择一条数据')
          return false
        } else {
          const data = []
          this.multipleSelection.forEach(function(a) {
            data.push(a.orderId)
          })
          checkExistence(data).then(res => {
            if (res.success && res.data && res.data.length > 0) {
              this.$message.error('存在已登记的订单')
              res.data.forEach(function(b) {
                const obj = that.list.find(item => item.orderId === b)
                if (obj) {
                  that.$refs.multipleTable.toggleRowSelection(obj, false)
                }
              })
            } else {
              this.number = this.number === 1 ? 2 : 1
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>

  /deep/ .nei .el-form-item .el-form-item__label{
    width: 55px !important;
  }
  /deep/ .nei .el-form-item .el-form-item__content{
  margin-left: 55px !important;
  }
  .llla{
    max-height: 153px;
    overflow: auto;
  }
  /deep/ .el-table thead {
    color: #606266;
  }
  .extra {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>
