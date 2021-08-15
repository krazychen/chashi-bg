<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
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
      <el-table-column
        type="index"
        :index="indexMethod"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column align="center" label="标题" width="280 ">
        <template slot-scope="scope">
          {{ scope.row.titleName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序" width="180 ">
        <template slot-scope="scope">
          {{ scope.row.sort }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-camera" title="查看" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleView(scope.row)" />
          <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:15px;" type="primary" @click="handleUpdate(scope.row)" />
          <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:15px;" type="primary" @click="handleDelete(scope.row)" />
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rulesText" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left:50px;">
        <el-form-item label="标题" prop="titleName">
          <el-input v-model="temp.titleName" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序号" />
        </el-form-item>
      </el-form>
      <div v-if="!chakan" slot="footer" class="dialog-footer">
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
import { getFacilitiesList, createFacilities, updateFacilities, deleteFacilities, updateStatusById } from '@/api/chashi/csFacilities'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CsFacilities',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      chakan: null,
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: '',
        titleName: '',
        sort: ''
      },
      headers: { 'Content-Type': 'multipart/form-data' },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        view: '查看'
      },
      rulesText: {
        titleName: [{ required: true, message: '请输入设施名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.fetchData()
  },
  methods: {
    indexMethod(index) {
      return index + 1
    },
    fetchData() {
      this.listLoading = true
      getFacilitiesList(this.listQuery).then(response => {
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
        titleName: '',
        sort: ''
      }
    },
    handleCreate() {
      this.chakan = false
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.temp)
          createFacilities(this.temp).then(() => {
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
    handleView(row) { // 查看详情
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'view'
      this.dialogFormVisible = true
      this.chakan = true
    },
    handleUpdate(row) {
      this.chakan = false
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateFacilities(tempData).then(() => {
            this.fetchData()
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
      if (this.temp.status === '1') {
        this.$message('已启用的服务设施无法删除！')
        return
      }
      deleteFacilities(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() { // 重置
      this.fetchData()
    },
    updateStatus(row) {
      let vv = '0'
      let msg = '已启用'
      if (row.status === '0') {
        vv = '1'
      }
      if (row.status === '1') {
        vv = '2'
        msg = '已停用'
      }
      if (row.status === '2') {
        vv = '1'
      }
      this.statusQueryParam.status = vv
      this.statusQueryParam.id = row.id
      updateStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        // const mess = vv === '0' ? '已启用' : '已停用'
        this.$message(msg)
      })
    }

  }
}
</script>

<style>
</style>
