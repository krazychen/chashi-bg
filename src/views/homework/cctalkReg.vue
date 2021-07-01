<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listRegQuery.regType" placeholder="请选择类型" clearable style="width: 200px" class="filter-item">
          <el-option v-for="item in regTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
        </el-select>
        <el-input v-model="listRegQuery.salesOrderId" placeholder="请输入关联订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listRegQuery.userName" placeholder="请输入cctalk用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-container">
        <el-input v-model="listRegQuery.studentNo" placeholder="请输入cctalk学籍号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listRegQuery.regInvitationCode" placeholder="请输入邀请码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listRegQuery.name" placeholder="请输入星舟账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </div>
      <div class="filter-container">
        <el-input v-model="listRegQuery.regUserName" placeholder="请输入课程顾问" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
                登记cctalk订单
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item class="custom-dropdown-menu-item">
              <el-button v-waves class="filter-item" type="primary" @click="registerCode">
                登记邀请码
              </el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <el-table
        v-loading="listRegLoading"
        :data="listReg"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column prop="regType" label="类型" align="center" :formatter="menuTypeFormat" />
        <el-table-column label="关联订单" align="center">
          <template slot-scope="scope">
            {{ scope.row.salesOrderId?scope.row.salesOrderId:"-" }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="关联订单金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dealFee!==null?scope.row.dealFee:"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" align="center" label="关联订单支付时间">
          <template slot-scope="scope">
            <span>{{ scope.row.billDate?scope.row.billDate:"-" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="cctalk用户名">
          <template slot-scope="scope">
            {{ scope.row.userName?scope.row.userName:"-" }}
          </template>
        </el-table-column>
        <el-table-column label="cctalk学籍号" align="center">
          <template slot-scope="scope">
            {{ scope.row.studentNo?scope.row.studentNo:"-" }}
          </template>
        </el-table-column>
        <el-table-column label="邀请码" align="center">
          <template slot-scope="scope">
            {{ scope.row.regInvitationCode?scope.row.regInvitationCode:"-" }}
          </template>
        </el-table-column>
        <el-table-column label="星舟账号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="返现金额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.cashBack!==null?scope.row.cashBack:"-" }}</span>
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
        <el-table-column label="课程顾问" prop="regUserName" />
        <el-table-column label="登记时间" prop="regTime" />
      </el-table>
      <pagination v-show="regTotal>0" :total="regTotal" :page.sync="listRegQuery.current" :limit.sync="listRegQuery.size" @pagination="fetchRegData" />
    </div>
    <el-dialog :visible.sync="dialogFormVisible" width="810px" @closed="closed">
      <div v-show="number===1">
        <div class="filter-container">
          <el-select v-model="listQuery.searchType" placeholder="搜索类型" clearable style="width: 200px" class="filter-item" @change="searchTypeChange">
            <el-option v-for="item in searchTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
          <el-autocomplete v-if="listQuery.searchType===0" v-model="listQuery.orderId" placeholder="请输入订单号" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect" />
          <el-autocomplete v-if="listQuery.searchType===1" v-model="listQuery.studentNo" placeholder="请输入学籍号" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect" />
          <el-autocomplete v-if="listQuery.searchType===2" v-model="listQuery.userName" placeholder="请输入用户名" style="width: 200px;" class="filter-item" :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect" />
        </div>
        <el-table
          ref="multipleTable"
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          height="430"
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
              <span>{{ scope.row.groupName }}</span>
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

      <el-form v-show="number===2" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 680px; height: 480px; margin-left:50px;">
        <div style="margin-bottom: 18px;">
          <span v-show="isUser">该用户已创建星舟账号：</span>
          <span v-show="!isUser">该用户尚未创建过星舟账号</span>
          <el-table
            v-loading="listUserLoading"
            style="margin-top: 18px;"
            border
            :data="listUser"
          >
            <el-table-column prop="username" label="账号" align="center" />
            <el-table-column prop="className" label="班级" align="center" />
            <el-table-column prop="studentNumber" label="学号" align="center" />
          </el-table>
        </div>
        <div class="llla">
          <el-row style="position: relative;">
            <el-col :span="22">
              <div
                v-for="(item, index) in temp.studentClassList"
                :key="index"
              >
                <el-row>
                  <el-col :span="11">
                    <el-form-item
                      label="班级"
                      :prop="'studentClassList.' + index + '.classId'"
                      :rules="{
                        required: true, message: '班级不能为空', trigger: 'blur'
                      }"
                    >
                      <el-select v-model="item.classId" filterable placeholder="请选择班级" :style="selectwidthz">
                        <el-option
                          v-for="classItem in classSelectList"
                          :key="classItem.id"
                          :label="classItem.className"
                          :value="classItem.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" class="nei">
                    <el-form-item label="学号">
                      <el-input v-model="item.studentNumber" placeholder="请输入学号" :style="selectwidthz" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-minus" title="删除班级及学号" style="line-height: 32px;font-weight: 800" @click.prevent="deleteStudentClass(item)" />
                    <!-- <el-button @click.prevent="deleteStudentClass(item)">删除</el-button>-->
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="2">
              <div style="position: absolute;bottom: 19px;">
                <i class="el-icon-plus" title="添加班级及学号" style="line-height: 32px;font-weight: 800" @click.prevent="addStudentClass()" />
              </div>
            </el-col>
          </el-row>

        </div>
        <el-form-item label="手机号" prop="studentPhone">
          <el-input v-model="temp.studentPhone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="返现" prop="cashBack">
          <el-input v-model="temp.cashBack" placeholder="请输入返现金额" />
        </el-form-item>
        <el-form-item label="课程顾问" prop="regUserId">
          <el-select v-model="temp.regUserId" filterable placeholder="请选择课程顾问">
            <el-option
              v-for="item in regUsers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="phone">
          <el-input v-model="temp.remarks" type="textarea" maxlength="100" show-word-limit :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="number === 1" type="primary" :disabled="disabled" @click="next()">
          {{ number === 1?'下一步':'上一步' }}
        </el-button>
        <el-button v-show="number===2" :disabled="disabled" type="primary" @click="determine">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormCodeVisible" width="810px" @closed="closed">
      <el-form ref="dataFormCode" :rules="rulesCode" :model="tempCode" label-position="left" label-width="100px" style="width: 680px; height: 270px; margin-left:50px;">
        <el-form-item label="邀请码" prop="regInvitationCode">
          <el-input v-model="tempCode.regInvitationCode" type="text" placeholder="请输入邀请码" maxlength="50" show-word-limit />
        </el-form-item>
        <div class="llla">
          <el-row style="position: relative;">
            <el-col :span="22">
              <div
                v-for="(item, index) in tempCode.studentClassList"
                :key="index"
              >
                <el-row>
                  <el-col :span="11">
                    <el-form-item
                      label="班级"
                      :prop="'studentClassList.' + index + '.classId'"
                      :rules="{
                        required: true, message: '班级不能为空', trigger: 'blur'
                      }"
                    >
                      <el-select v-model="item.classId" filterable placeholder="请选择班级" :style="selectwidthz">
                        <el-option
                          v-for="classItem in classSelectList"
                          :key="classItem.id"
                          :label="classItem.className"
                          :value="classItem.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11" class="nei">
                    <el-form-item label="学号">
                      <el-input v-model="item.studentNumber" placeholder="请输入学号" :style="selectwidthz" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <i class="el-icon-minus" title="删除班级及学号" style="line-height: 32px;font-weight: 800" @click.prevent="deleteStudentClass(item)" />
                    <!-- <el-button @click.prevent="deleteStudentClass(item)">删除</el-button>-->
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="2">
              <div style="position: absolute;bottom: 19px;">
                <i class="el-icon-plus" title="添加班级及学号" style="line-height: 32px;font-weight: 800" @click.prevent="addStudentClass()" />
              </div>
            </el-col>
          </el-row>

        </div>
        <el-form-item label="手机号" prop="studentPhone">
          <el-input v-model="tempCode.studentPhone" placeholder="请输入手机号" />
        </el-form-item>
        <!--        <el-form-item label="返现" prop="cashBack">
          <el-input v-model="tempCode.cashBack" placeholder="请输入返现金额" />
        </el-form-item>-->
        <el-form-item label="课程顾问" prop="regUserId">
          <el-select v-model="tempCode.regUserId" filterable placeholder="请选择课程顾问">
            <el-option
              v-for="item in regUsers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="phone">
          <el-input v-model="tempCode.remarks" type="textarea" maxlength="100" show-word-limit :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="disabled" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" :disabled="disabled" @click="determineCode">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPageList, getUserStudentNumber, addCctalkSalesOrderReg, getPageRegList, getCandidateList, checkExistenceReg, getRefUsers, addCctalkSalesOrderRegCode } from '@/api/homework/cctalk.js'
import { getClassListByStudentId } from '@/api/homework/student'
import Pagination from '@/components/Pagination'
import { getAllClass } from '@/api/homework/hwClass'
import { validatePhone } from '@/utils/validate'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'
import { unEscape } from '@/utils/index'

export default {
  name: 'CctalkReg',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      disabled: false,
      regUsers: [],
      listUserLoading: false,
      listUser: [],
      multipleSelection: [],
      isUser: true,
      rules: {
        studentPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone }],
        cashBack: [{ required: true, message: '请输入返现金额', trigger: 'blur' }, { validator: this.validatorCashBack }]
      },
      rulesCode: {
        regInvitationCode: [{ required: true, message: '请输入邀请码', trigger: 'blur' }, { validator: this.validatorCode }],
        studentPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone }]/*, */
        /*
        cashBack: [{ required: true, message: '请输入返现金额', trigger: 'blur' }, { validator: this.validatorCashBack }]
*/
      },
      searchTypes: [{ dictValue: 0, dictLabel: '订单号' }, { dictValue: 1, dictLabel: '学籍号' }, { dictValue: 2, dictLabel: '用户名' }],
      classSelectList: [],
      list: [],
      listLoading: false,
      dialogFormVisible: false,
      dialogFormCodeVisible: false,
      dialogStatus: '',
      number: 1,
      submitType: 'create',
      temp: {
        id: undefined,
        studentPhone: '',
        studentNo: undefined,
        regUserId: undefined,
        cashBack: '',
        remarks: undefined,
        orderId: undefined,
        studentClassList: [
          {
            id: null,
            classId: null,
            studentId: null,
            studentNumber: null
          }
        ]
      },
      tempCode: {
        id: undefined,
        studentPhone: '',
        studentNo: undefined,
        regUserId: undefined,
        regInvitationCode: undefined,
        /* cashBack: '',*/
        remarks: undefined,
        studentClassList: [
          {
            id: null,
            classId: null,
            studentId: null,
            studentNumber: null
          }
        ]
      },
      total: 0,
      regTotal: 0,
      regTypes: [],
      listReg: [],
      listRegLoading: true,
      listRegQuery: {
        regType: undefined,
        salesOrderId: undefined,
        userName: undefined,
        name: undefined,
        regUserName: undefined,
        regInvitationCode: undefined,
        studentNo: undefined
      },
      listQuery: {
        current: 1,
        orderId: undefined,
        studentNo: undefined,
        userName: undefined,
        searchType: 0
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
    this.listRegLoading = false
    this.regTypes = getDictDataList('cctalk_sales_order_reg_type')
    this.fetchRegData()
    this.getClassList()
    this.getRegUsers()
  },
  methods: {
    cancel() {
      this.dialogFormCodeVisible = false
      this.tempCode = {
        id: undefined,
        studentPhone: '',
        studentNo: undefined,
        regUserId: undefined,
        regInvitationCode: '',
        cashBack: '',
        remarks: undefined,
        studentClassList: [
          {
            id: null,
            classId: null,
            studentId: null,
            studentNumber: null
          }
        ]
      }
      this.$nextTick(() => {
        this.$refs['dataFormCode'].clearValidate()
      })
    },
    getRegUsers() {
      getRefUsers().then(res => {
        if (res.success) {
          this.regUsers = res.data
        }
      })
    },
    checkSelectable(row) {
      return row.isReg === '0'
    },
    unescape(html) {
      return unEscape(html)
    },
    handleSelect() {
      this.reset()
      this.fetchData()
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
    registerCode() {
      this.dialogFormCodeVisible = true
    },
    reset() {
      this.$refs.multipleTable.clearSelection()
      this.temp = {
        id: undefined,
        studentPhone: '',
        studentNo: undefined,
        cashBack: '',
        remarks: undefined,
        orderId: undefined,
        studentClassList: [
          {
            id: null,
            classId: null,
            studentId: null,
            studentNumber: null
          }
        ]
      }
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
    },
    determineCode() {
      this.$refs['dataFormCode'].validate((valid) => {
        if (valid) {
          this.disabled = true
          addCctalkSalesOrderRegCode({ cctalkSalesOrderReg: { studentNo: this.tempCode.studentNo, studentPhone: this.tempCode.studentPhone, cashBack: this.tempCode.cashBack, remarks: this.tempCode.remarks, regUserId: this.tempCode.regUserId, regInvitationCode: this.tempCode.regInvitationCode }, studentClassList: this.tempCode.studentClassList }).then(res => {
            if (res.success && res.data != null && res.data) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormCodeVisible = false
              this.cancel()
              this.fetchRegData()
            } else {
              this.$notify({
                title: '失败',
                message: this.unescape(res.msg),
                type: 'error',
                duration: 2000
              })
            }
          }).finally(r => {
            this.disabled = false
          })
        }
      })
    },
    determine() {
      const that = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = []
          this.multipleSelection.forEach(function(a) {
            data.push({ studentNo: a.studentNo, studentPhone: that.temp.studentPhone, cashBack: that.temp.cashBack, remarks: that.temp.remarks, orderId: a.orderId, studentClassList: that.temp.studentClassList, regUserId: that.temp.regUserId })
          })
          this.disabled = true
          addCctalkSalesOrderReg(data).then(res => {
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
                message: this.unescape(res.msg),
                type: 'error',
                duration: 2000
              })
            }
          }).finally(r => {
            this.disabled = false
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
    validatorCode(rule, value, callback) {
      const regs = /^[A-Za-z0-9]+$/
      if (value.length === 0) {
        callback()
      } else {
        if (!regs.test(value)) {
          callback([new Error('只能输入数字、字母')])
        } else {
          callback()
        }
      }
    },
    getStudentClassList(row) {
      this.editStudentId = row.id
      const queryObj = { studentId: row.id }
      getClassListByStudentId(queryObj).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          this.temp.studentClassList = res.data
          this.studentClassEditVisible = true
        }
      })
    },
    getClassList() {
      getAllClass().then(res => {
        if (res.success && res.data) {
          this.classSelectList = res.data
        }
      })
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
      this.listRegQuery.page = 1
      this.fetchRegData()
    },
    restHandleFilter() {
      this.listRegQuery.page = 1
      this.listRegQuery = {
        regType: undefined,
        salesOrderId: undefined,
        userName: undefined,
        name: undefined,
        regTypeCode: undefined,
        studentNo: undefined
      }
      this.fetchRegData()
    },
    fetchRegData() {
      this.listRegLoading = true
      getPageRegList(this.listRegQuery).then(response => {
        if (response.success) {
          this.listReg = response.data.records
          this.regTotal = parseInt(response.data.total)
          this.listRegLoading = false
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
      this.submitType = 'create'
      const that = this
      this.listUser = []
      if (this.number === 1) {
        if (this.multipleSelection.length < 1) {
          this.$message.error('请选择一条数据')
          return false
        } else {
          const data = []
          this.multipleSelection.forEach(function(a) {
            data.push(a.orderId)
          })
          checkExistenceReg(data).then(r => {
            if (r.success && r.data && r.data.length > 0) {
              this.$message.error('存在已登记的订单')
              r.data.forEach(function(b) {
                const obj = that.list.find(item => item.orderId === b)
                if (obj) {
                  that.$refs.multipleTable.toggleRowSelection(obj, false)
                }
              })
            } else {
              this.temp.studentNo = this.multipleSelection[0].studentNo
              this.temp.orderId = this.multipleSelection[0].orderId
              this.listUserLoading = true
              // 根据订单号查询是否在星舟系统有账号，有则获取账号和班级学号信息
              getUserStudentNumber(this.multipleSelection[0].studentNo).then(res => {
                if (res.success) {
                  this.number = this.number === 1 ? 2 : 1
                  if (res.data) {
                    this.listUser = res.data
                    if (res.data.length > 0) {
                      this.isUser = true
                      this.temp.studentClassList = this.listUser
                    } else {
                      this.isUser = false
                      this.temp.studentClassList = [
                        {
                          id: null,
                          classId: null,
                          studentId: null,
                          studentNumber: null
                        }
                      ]
                    }
                    this.listUserLoading = false
                  } else {
                    this.submitType = 'update'
                  }
                }
              })
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
