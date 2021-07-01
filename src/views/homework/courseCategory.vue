<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="分类名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="分类类型" clearable style="width: 200px" class="filter-item" />
      <dictSelect v-model="temp.state" placeholder="类型" class="filter-item" dict-type="sys_role_type" />
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeletes">
        删除
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
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55px"
      />
      <el-table-column align="center" label="分类名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="分类类型" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">禁用</span>
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 2">锁定</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i class="el-icon-edit" style="color: #67C23A;margin-left:10px;" title="编辑" type="primary" @click="handleUpdate(scope.row)" />
          <span v-if="scope.row.status == 1">
            <i class=" el-icon-remove" title="禁用" style="color: #F56C6C;margin-left:10px;" type="primary" @click="statusUpdate(scope.row)" />
          </span>
          <span v-if="scope.row.status == 0">
            <i class=" el-icon-success" title="启用" style="color: #F56C6C;margin-left:10px;" type="primary" @click="statusUpdate(scope.row)" />
          </span>
          <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" type="primary" title="删除" @click="handleDelete(scope.row)" />
          <i class="el-icon-circle-plus" style="color: #409EFF;margin-left:10px;" title="新增" @click="childCreates(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 420px; margin-left:50px;">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类类型" prop="type">
          <el-input v-model="temp.type" placeholder="请输入分类类型" />
        </el-form-item>
        <!--<el-form-item label="分类类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择分类类型" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in genders" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>-->
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="请输入备注信息" type="textarea" :rows="3" />
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
import { getCourseCategoryList, createCourseCategory, updateCourseCategory, deleteCourseCategory, statusUpdate, batchDeletes } from '@/api/homework/courseCategory'
import Pagination from '@/components/Pagination'
import DictSelect from '@/components/Dict'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CourseCategory',
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
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        name: undefined,
        type: undefined,
        status: undefined
      },
      temp: {
        id: undefined,
        multipleSelection: [],
        attrTypeOptions: [],
        delarr: [],
        name: '',
        type: '',
        sort: '',
        remarks: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
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
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择分类类型', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]

      }
    }
  },
  beforeCreate() {
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCourseCategoryList(this.listQuery).then(response => {
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
        parentId: '',
        name: '',
        type: '',
        sort: '',
        remarks: '',
        status: 1,
        deleted: 0,
        version: 0
      }
    },
    handleCreate() {
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
          createCourseCategory(this.temp).then(() => {
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateCourseCategory(tempData).then(() => {
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
      deleteCourseCategory(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    statusUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      statusUpdate(this.temp.id).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '状态修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    rest() {
      this.listQuery.name = undefined
      this.listQuery.type = undefined
      this.listQuery.status = undefined
      this.fetchData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDeletes() {
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
      for (let i = 0; i < length; i++) {
        this.temp.delarr.push(this.multipleSelection[i].id)
      }
      batchDeletes(this.temp.delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    childCreates(row) {
      this.resetTemp()
      this.temp.parentId = row.id
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
