<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.appKey" placeholder="请输入appKey" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.corpCode" placeholder="请输入租户代码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cropName" placeholder="请输入租户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="reset">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
      <el-table-column align="center" label="appKey">
        <template slot-scope="scope">
          {{ scope.row.appKey }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="租户名称">
        <template slot-scope="scope">
          {{ scope.row.corpName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="租户代码">
        <template slot-scope="scope">
          {{ scope.row.corpCode }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="540px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="appKey" prop="appKey">
          <el-input v-model="temp.appKey" placeholder="请输入appKey" />
        </el-form-item>
        <el-form-item label="租户代码" prop="corpCode">
          <el-input v-model="temp.corpCode" placeholder="请输入租户代码" />
        </el-form-item>
        <el-form-item label="租户名称" prop="corpName">
          <el-input v-model="temp.corpName" placeholder="请输入租户名称" />
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
import { getCctalkCropPageList, addCctalkCrop, updateCctalkCrop, deleteCctalkCrop } from '@/api/homework/cctalk'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量

export default {
  name: 'CctalkCorp',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        appKey: undefined,
        cropCode: undefined,
        cropName: undefined
      },
      temp: {
        id: undefined,
        appKey: '',
        corpCode: '',
        cropName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      disabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        appKey: [{ required: true, message: '请输入appKey', trigger: 'blur' }],
        corpCode: [{ required: true, message: '请输入租户代码', trigger: 'blur' }],
        corpName: [{ required: true, message: '请输入租户名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCctalkCropPageList(this.listQuery).then(response => {
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
        appKey: '',
        cropName: '',
        corpCode: ''
      }
    },
    reset() {
      this.listQuery = {
        current: 1,
        appKey: undefined,
        cropCode: undefined,
        cropName: undefined
      }
      this.fetchData()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.disabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addCctalkCrop(this.temp).then(res => {
            if (res.success && res.data) {
              this.fetchData()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败，' + res.msg,
                type: 'error',
                duration: 2000
              })
            }
            // this.list.unshift(this.temp)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.disabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateCctalkCrop(tempData).then(res => {
            if (res.success && res.data) {
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
            } else {
              this.$notify({
                title: '失败',
                message: '创建失败，' + res.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteCctalkCrop(this.temp.id).then(() => {
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
