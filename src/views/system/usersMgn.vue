<template>
  <el-row>
    <el-col :span="4"><div class="grid-content bg-purple">
      <div class="app-container">
        <span style="font-size: 15px;">用户管理</span><span><i class="el-icon-refresh" style="color: #2df5b7;float: right;" @click="refresh" /></span>
        <el-input
          v-model="filterText"
          style="margin-top: 10px;"
          placeholder="输入关键字进行过滤"
        />
        <el-tree
          ref="tree"
          v-loading="listLoading1"
          class="filter-tree"
          style="width: 100%;font-size: 18px"
          :data="list1"
          :props="defaultProps"
          :highlight-current="true"
          :filter-node-method="filterNode"
          @node-click="treeClick"
        />
      </div>
    </div>
    </el-col>
    <el-col :span="20"><div class="grid-content bg-purple-light">
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input v-model="listQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.state" placeholder="状态" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in stateCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
            重置
          </el-button>
          <el-button v-permission="['sys:user:add']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            新增
          </el-button>
          <el-dropdown class="filter-item" trigger="click" placement="top">
            <el-button type="primary" class="el-dropdown-link">
              更多
              <i class="el-icon-caret-bottom" />
            </el-button>
            <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="tableDeleteRow('','deletes')">
                  删除
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-success" @click="updateStatus(1)">
                  启用
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-remove" @click="updateStatus(0)">
                  停用
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-d-arrow-right" @click="batchAssignRoles">
                  分配角色
                </el-button>
              </el-dropdown-item>
              <el-dropdown-item class="custom-dropdown-menu-item">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="handleUpdatePassWord">
                  设置密码
                </el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column label="本功能主要用来创建管理员账号">
            <el-table-column
              type="selection"
              label="勾选"
              width="55px"
            />
            <el-table-column align="center" label="序号" width="95">
              <template slot-scope="scope">
                {{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户名" width="95">
              <template slot-scope="scope">
                {{ scope.row.username }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="昵称" width="110">
              <template slot-scope="scope">
                {{ scope.row.nickname }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="电子邮箱" width="210">
              <template slot-scope="scope">
                {{ scope.row.email }}
              </template>
            </el-table-column>
            <el-table-column label="手机号码" width="110" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别" width="60" align="center" prop="gender" :formatter="genderFormat" />
            <el-table-column label="用户类型" width="110" align="center" prop="userType" :formatter="userTypeFormat" />
            <el-table-column label="开通方式" prop="regType" width="90" align="center" :formatter="regTypeFormat" />
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <el-table-column class-name="status-col" label="状态" width="110" align="center" prop="state" :formatter="stateFormat" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:10px;" type="primary" @click="handleUpdate(scope.row)" />
                <span v-if="scope.row.state == 1">
                  <i class=" el-icon-remove" title="禁用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="updateState1(scope.row)" />
                </span>
                <span v-if="scope.row.state == 0">
                  <i class=" el-icon-success" title="启用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="updateState1(scope.row)" />
                </span>
                <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="tableDeleteRow(scope.row,'delete')" />
                <i class="el-icon-arrow-right" title="分配角色" tooltip="true" style="color: #409EFF;margin-left:10px;" @click="assignRoles(scope.row)" />
              </template>
            </el-table-column>
          </el-table-column>

        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="580px">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 450px; margin-left:50px;">
            <el-form-item label="归属机构">
              <el-tree-select ref="treeSelect" v-model="temp.officeId" :styles="styles" :select-params="selectParams" node-key="id" :tree-params="treeParams" :tree-render-fun="_renderFun" @searchFun="_searchFun" @node-click="_nodeClickFun" />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="temp.username" placeholder="请输入用户名" :disabled="usernameDisabled" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="temp.nickname" placeholder="请输入昵称" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
              <el-select v-model="temp.userType" placeholder="请选择用户类型" :style="selectwidthz">
                <el-option v-for="item in typesOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="temp.gender" placeholder="请选择性别" :style="selectwidthz">
                <el-option v-for="item in genderCodes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="temp.email" placeholder="请输入电子邮箱" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="temp.phone" placeholder="请输入手机号码" oninput="value=value.replace(/[^\d]/g,'')" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="temp.remarks" placeholder="请输入备注信息" type="textarea" :rows="3" :style="selectwidthz" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
              确定
            </el-button>
          </div>
        </el-dialog>
        <el-dialog :title="textMap[dialogStatus1]" :visible.sync="dialogFormVisible1" @open="handleData">
          <el-table
            ref="multipleTable"
            :data="rolelist"
            style="width: 100%"
            @selection-change="handleSelectionChange1"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="角色名称"
            />
            <el-table-column
              prop="code"
              label="角色编码"
            />
          </el-table>
          <pagination v-show="roletotal>0" :total="roletotal" :page.sync="rolelistQuery.current" :limit.sync="rolelistQuery.size" />
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">
              取消
            </el-button>
            <el-button type="primary" @click="dialogStatus1==='one'?assignData():assignsData()">
              确定
            </el-button>
          </div>
        </el-dialog>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
          <div class="del-dialog-cnt">请确认是否删除数据！</div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="delVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 设置密码 -->
        <el-dialog title="密码设置" :visible.sync="passworkVisible" width="400px" :show-close="false" @closed="guanbi">
          <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="ruless" label-width="100px" class="demo-ruleForm" label-position="top">
            <el-form-item label="密码" prop="pass">
              <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="passworkVisible = false">取 消</el-button>
            <el-button type="primary" @click="passwordSetting()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div></el-col>
  </el-row>
</template>
<script>
import { getUserList, createUser, updateUser, deleteUser, getParentCodeTrees, stateUpdate, deleteUsers, getRoleList, addRoleList, addUserRoleList, updateByStatus, findRoles, passwordSetting } from '@/api/system/users'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getDictDataList } from '@/utils/dictUtils'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UsersMgn',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  data() {
    return {
      styles: {
        width: '280px'
      },
      ruless: {
        pass: [
          { validator: this.validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: this.validatePass2, trigger: 'blur' }
        ]
      },
      ruleForm: {
        checkPass: '',
        pass: ''
      },
      passworkVisible: false,
      rowr: {},
      delVisible: false,
      list: [],
      rows: {},
      listLoading: true,
      listLoading1: true,
      total: 0,
      list1: [],
      list2: [],
      list3: [],
      typesOptions: [],
      genderCodes: [],
      regTypeCodes: [],
      stateCodes: [],
      rolelist: [],
      roletotal: 0,
      userIds: null,
      userId: null,
      listQuery: {
        current: 1,
        officeId: undefined,
        username: undefined,
        nickname: undefined,
        phone: undefined,
        state: undefined
      },
      rolelistQuery: {
        current: 1
      },
      temp: {
        id: undefined,
        multipleSelection: [],
        multipleSelection1: [],
        delarr: [],
        username: '',
        nickname: '',
        email: '',
        password: '',
        phone: '',
        userType: '',
        remarks: '',
        gender: '',
        state: '',
        name: '',
        code: ''
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      dialogStatus1: '',
      usernameDisabled: false,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请选择'
      },
      treeParams: {
        clickParent: true,
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          children: 'children',
          label: 'label',
          value: 'id'
        }
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        userType: [{ required: true, message: '请选择用户类型', trigger: 'blur' }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '280px'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.stateCodes = getDictDataList('sys_status')
    this.regTypeCodes = getDictDataList('sys_reg_type')
    this.genderCodes = getDictDataList('sys_sex_type')
    this.typesOptions = getDictDataList('sys_user_type')
    this.fetchData()
    this.getParentTree()
  },
  methods: {
    guanbi() {
      this.$refs['ruleForm'].resetFields()
    },
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    },
    validatePass2(rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    passwordSetting() {
      this.passworkVisible = true
      let length = 0
      if (this.multipleSelection) {
        length = this.multipleSelection.length
      }
      if (length < 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      if (length > 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.id = this.multipleSelection[0].id
          passwordSetting(this.ruleForm).then(res => {
            if (res.data) {
              this.fetchData()
              this.$notify({
                title: '成功',
                message: '密码重置成功！',
                type: 'success',
                duration: 2000
              })
              this.passworkVisible = false
            }
          })
        }
      })
    },
    fetchData() {
      this.listLoading = true
      // console.log(this.listQuery)
      getUserList(this.listQuery).then(response => {
        // console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    tableDeleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        let length = 0
        if (this.multipleSelection === undefined) {
          this.multipleSelection = []
        }
        length = this.multipleSelection.length
        if (length < 1) {
          this.$message({
            message: '请选择一条或多条数据!',
            type: 'warning'
          })
        } else {
          this.delVisible = true
        }
      }
    },
    getParentTree() {
      this.listLoading1 = true
      getParentCodeTrees({}).then(response => {
        this.list1 = response.data
        this.listLoading1 = false
      })
    },
    getParentTrees(row) {
      getParentCodeTrees({}).then(response => {
        this.list2 = response.data
        this.$refs.treeSelect.treeDataUpdateFun(this.list2)
      })
    },
    treeClick(val) {
      this.listQuery.officeId = val.id
      this.rows = val
      this.fetchData()
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
        password: '123456',
        phone: '',
        gender: '',
        state: 1, // 默认启用
        officeId: '',
        officeName: '',
        regType: '1', // 开通方式为手工
        mgrType: 0 // 暂时写死
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.officeId = this.rows.id
      this.temp.officeName = this.rows.label
      this.getParentTrees(row)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.usernameDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          createUser(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      if (row.state !== 0) {
        this.$message.error('只有禁用状态的机构才允许编辑！')
        return false
      }
      this.temp = Object.assign({}, row) // copy obj
      this.getParentTrees(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateUser(tempData).then(() => {
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
          })
        }
      })
    },
    assignRoles(row) { // 单个分配角色
      this.dialogFormVisible1 = true
      this.userId = row.id
    },
    handleDelete() {
      this.delVisible = false
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteUser(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    refresh() { // 刷新树
      this.getParentTree()
    },
    rest() { // 重置
      this.listQuery.username = undefined
      this.listQuery.nickname = undefined
      this.listQuery.phone = undefined
      this.listQuery.state = undefined
      this.fetchData()
    },
    updateState1(row) {
      stateUpdate(row.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '状态修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDeletes() {
      const length = this.multipleSelection.length
      this.temp.delarr = []
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      this.delVisible = false
      deleteUsers(this.temp.delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateStatus(row) {
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据！',
          type: 'warning'
        })
        return false
      }
      this.temp.delarr = []
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      const param = {}
      param.idList = this.temp.delarr
      param.status = row
      console.log(row)
      updateByStatus(param).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '状态批量修改成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdatePassWord() {
      let length = 0
      if (this.multipleSelection) {
        length = this.multipleSelection.length
      }
      if (length < 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      if (length > 1) {
        this.$message({
          message: '请选择一条记录！',
          type: 'warning'
        })
        return false
      }
      this.passworkVisible = true
    },
    assignData() { // 单个分配用户角色
      this.dialogStatus1 = 'one'
      const length = this.multipleSelection1.length
      var roleIds = ''
      for (let i = 0; i < length; i++) {
        // if (this.list3.indexOf(this.multipleSelection1[i].id) === -1) {
        roleIds += this.multipleSelection1[i].id + ','
        // }
      }
      if (roleIds === '') {
        this.$message({
          message: '请选择角色！',
          type: 'warning'
        })
        return false
      }
      const data1 = {}
      console.log(roleIds)
      data1.userId = this.userId
      data1.roleId = roleIds
      addRoleList(data1).then(() => {
        this.fetchData()
        this.dialogFormVisible1 = false
        this.$notify({
          title: '成功',
          message: '用户分配角色成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    assignsData() { // 批量分配用户角色
      this.dialogStatus1 = 'two'
      const length = this.multipleSelection1.length
      var roleIds = ''
      for (let i = 0; i < length; i++) {
        roleIds += this.multipleSelection1[i].id + ','
      }
      const data1 = {}
      data1.userId = this.userIds.join(',')
      data1.roleId = roleIds
      addUserRoleList(data1).then(() => {
        this.fetchData()
        this.dialogFormVisible1 = false
        this.$notify({
          title: '成功',
          message: '批量分配角色成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    batchAssignRoles() { // 批量分配多个用户角色
      let length = 0
      if (this.multipleSelection === undefined) {
        this.multipleSelection = []
      }
      length = this.multipleSelection.length
      if (length < 1) {
        this.$message({
          message: '请选择一条或多条数据！',
          type: 'warning'
        })
        return false
      }
      console.log(this.userIds)
      this.userIds = null
      this.temp.delarr = []
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      this.userIds = this.temp.delarr // 用户id集合
      this.userId = null
      this.assignRoles()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange1(val) {
      this.multipleSelection1 = val
    },
    // 树点击
    _nodeClickFun(data, node, vm) {
      console.log('this _nodeClickFun', this.values, data, node)
    },
    // 树过滤
    _searchFun(value) {
      console.log(value, '<--_searchFun')
      // 自行判断 是走后台查询，还是前端过滤
      // this.$refs.treeSelect.$refs.tree.filter(value);
      this.$refs.treeSelect.filterFun(value)
      // 后台查询
      // this.$refs.treeSelect.treeDataUpdateFun(treeData);
    },
    _renderFun(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    },
    handleData() {
      if (this.userId != null) {
        this.dialogStatus1 = 'one'
        findRoles(this.userId).then(response => {
          this.list3 = response.data
          let arrId = []
          arrId = this.list3.split(',')
          console.log(arrId)
          if (arrId.length > 0) {
            getRoleList(this.rolelistQuery).then(response => {
              this.rolelist = response.data.records
              this.roletotal = parseInt(response.data.total)
              this.$nextTick(() => {
                for (let i = 0; i < this.rolelist.length; i++) {
                  for (let j = 0; j < arrId.length; j++) {
                    if (arrId[j] === this.rolelist[i].id) {
                      this.$refs.multipleTable.toggleRowSelection(this.rolelist[i], true)
                    }
                  }
                }
              })
            })
          } else {
            getRoleList(this.rolelistQuery).then(response => {
              this.rolelist = response.data.records
              this.roletotal = parseInt(response.data.total)
            })
          }
        })
      } else {
        this.dialogStatus1 = 'two'
        getRoleList(this.rolelistQuery).then(response => {
          this.rolelist = response.data.records
          this.roletotal = parseInt(response.data.total)
        })
      }
    },
    userTypeFormat(row) {
      let vv = '-'
      const typ = this.typesOptions
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.userType) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    regTypeFormat(row) {
      let vv = '-'
      const typ = this.regTypeCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.regType) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    genderFormat(row) {
      let vv = '-'
      const typ = this.genderCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.gender.toString()) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    stateFormat(row) {
      let vv = '-'
      const typ = this.stateCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.state.toString()) {
          vv = aa.dictLabel
        }
      })
      return vv
    }
  }
}
</script>
