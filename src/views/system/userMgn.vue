<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.gender" placeholder="性别" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete">
        删除
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-download">
        导出
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
<!--      <el-table-column align="center" label="序号" width="95">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.$index+1 }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="center" label="用户ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" width="95">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender | genderFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名" :disabled="usernameDisabled" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="temp.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" placeholder="请选择性别" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
<!--          <el-select v-model="temp.state" class="filter-item" placeholder="Please select">-->
<!--            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />-->
<!--          </el-select>-->
            <dictSelect v-model="temp.state" class="filter-item" dictType="sys_yes_no" />
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
  </div>
</template>

<script>
import { getUserList, createUser, updateUser, deleteUser } from '@/api/system/user'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect },
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
        username: undefined,
        gender: undefined
      },
      temp: {
        id: undefined,
        username: '',
        nickname: '',
        password: '',
        phone: '',
        gender: 1,
        state: '0',
        departmentId: 1, // 暂时写死
        roleId: 1 // 暂时写死
      },
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      genders: [{
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      stateOptions: [{
        value: 0,
        label: '禁用'
      }, {
        value: 1,
        label: '启用'
      }, {
        value: 2,
        label: '锁定'
      }],
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        gender: [{ required: true, message: '请选择性别', trigger: 'change' }]
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
    fetchData() {
      this.listLoading = true
      getUserList(this.listQuery).then(response => {
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
      this.temp = Object.assign({}, row) // copy obj
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
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteUser(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
