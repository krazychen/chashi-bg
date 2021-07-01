<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.typeName" placeholder="标签名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remarks" placeholder="标签备注" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="标签状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in statuss" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetListQuery">
        重置
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column label="标签名称">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
      </el-table-column>
      <el-table-column label="标签备注">
        <template slot-scope="scope">
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="标签状态"
        :formatter="menuTypeFormat"
      />
      <el-table-column label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <i
            v-if="scope.row.status===0"
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i v-if="scope.row.status===0" class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="tableDeleteRow(scope.row,'delete')" />
          <i v-if="scope.row.status===0 || scope.row.status===2" class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-ban" style="color: #F56C6C;margin-left:10px;" title="禁用" @click="updateStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="490px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="标签名称" prop="typeName">
          <el-input v-model="temp.typeName" placeholder="请输入标签名称" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="标签备注">
          <el-input v-model="temp.remarks" type="textarea" placeholder="请输入标签备注" :style="selectwidthz" />
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

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">请确认是否删除数据！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getHwClassTypeList, createHwClassType, updateHwClassType, deleteHwClassType, deleteHwClassTypes, updateStatusById } from '@/api/homework/hwClassType'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import { getDictDataList } from '@/utils/dictUtils'

// 让data数据在创建阶段透传到全局变量
export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect },
  directives: { waves },
  data() {
    return {
      statuss: [], // 状态
      statusQueryParam: {},
      delVisible: false,
      rowrows: [],
      multipleSelection: [],
      list: null,
      listLoading: true,
      total: 0,
      deleteor: 'delete',
      listQuery: {
        current: 1,
        typeName: undefined,
        status: undefined,
        remarks: undefined
      },
      temp: {
        username: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      usernameDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        typeName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  created() {
    this.statuss = getDictDataList('hw_class_type_status')
    this.fetchData()
  },
  methods: {
    resetListQuery() {
      this.listQuery.typeName = undefined
      this.listQuery.status = undefined
      this.listQuery.remarks = undefined
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      getHwClassTypeList(this.listQuery).then(response => {
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
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteHwClassType(this.temp.id).then(() => {
        this.fetchData()
        this.delVisible = false
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    tableDeleteRow(row, or) {
      if (row.status === 1) {
        this.$message('已发布无法删除')
        return false
      }
      if (row.status === 2) {
        this.$message('已冻结无法删除')
        return false
      }
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          this.delVisible = true
        }
      }
    },
    handleDeletes() {
      const length = this.multipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        delarr.push(this.multipleSelection[i].id)
      }
      deleteHwClassTypes(delarr).then(() => {
        this.fetchData()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
        this.delVisible = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: ''
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
          createHwClassType(this.temp).then(() => {
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
      if (row.status === 1) {
        this.$message('已发布无法编辑')
        return false
      }
      if (row.status === 2) {
        this.$message('已冻结无法编辑')
        return false
      }
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
          updateHwClassType(tempData).then(() => {
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
    }, deleteRow(row, or) {
      this.deleteor = or
      if (this.deleteor === 'delete') {
        this.rowr = row
        this.delVisible = true
      } else {
        if (this.multipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          const length = this.multipleSelection.length
          this.delarr = []
          for (let i = 0; i < length; i++) {
            if (this.multipleSelection[i].status === 1) {
              this.$message('已发布无法删除')
              return false
            }
            if (this.multipleSelection[i].status === 2) {
              this.$message('已冻结无法删除')
              return false
            }
            this.delarr.push(this.multipleSelection[i].areaCode)
          }
          this.delVisible = true
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    updateStatus(row) {
      let vv = 0
      let msg = '已启用'
      if (row.status === 0) {
        vv = 1
      }
      if (row.status === 1) {
        vv = 2
        msg = '已停用'
      }
      if (row.status === 2) {
        vv = 1
      }
      this.statusQueryParam.status = vv
      this.statusQueryParam.id = row.id
      updateStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        // const mess = vv === 0 ? '未发布' : (vv === 1 ? '发布' : '冻结')
        this.$message(msg)
        this.delVisible = false
      })
    }
  }
}
</script>
