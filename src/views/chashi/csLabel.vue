<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.titleName"
        placeholder="请输入标签名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.sort"
        placeholder="请输入标签排序"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="resetFilter">
        重置
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
        删除
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column
        align="center"
        prop="titleName"
        label="标签名称"
      />
      <el-table-column
        align="center"
        prop="sort"
        label="标签排序"
      />
      <el-table-column
        align="center"
        prop="updateTime"
        label="更新时间"
      />
      <el-table-column
        align="center"
        prop="status"
        label="状态"
        :formatter="statusFormat"
      />
      <el-table-column width="130px" label="操作">
        <template slot-scope="scope">
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
          <i class="el-icon-edit" title="修改" style="color: #67C23A;margin-left:10px;" @click="handleUpdate(scope.row)" />
          <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRow(scope.row,'delete')" />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="530px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 390px; margin-left:50px;">
        <el-form-item label="标签名称" prop="titleName">
          <el-input
            v-model="temp.titleName"
            placeholder="请输入标签名称"
            @input="lengthUtil(temp.titleName,100,'titleName')"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="请输入排序"  />
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
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { isNum } from '@/utils/validate'
import { getDictDataList } from '@/utils/dictUtils'

import {
  createCsLabel,
  getCsLabelList,
  updateCsLabel,
  deleteCsLabel,
  deleteCsLabels,
  updateStatusById
} from '@/api/chashi/csLabel.js'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      styles: {
        width: '300px'
      },
      dialogStatus: 'create',
      total: 0,
      dialogFormVisible: false,
      deleteor: 'delete',
      delVisible: false,
      tableDelVisible: false,
      listLoading: true,
      rowr: {},
      tableData: [{}],
      statuss: [],
      multipleSelection: [],
      listQuery: {
        current: 1,
        titleName: undefined,
        sort: undefined
      },
      temp: {
        titleName: '',
        sort: '',
        isSys: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        titleName: [{ required: true, message: '标签名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'blur' }, { validator: isNum, trigger: 'blur' }]
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
    this.statuss = getDictDataList('sys_status')
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getCsLabelList(this.listQuery).then(response => {
        this.tableData = response.data.records
        console.log(this.tableData)
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createCsLabel(this.temp).then(() => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCsLabel(tempData).then(() => {
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
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    resetFilter() {
      // 重置
      this.listQuery.titleName = undefined
      this.listQuery.sort = undefined
      this.handleFilter()
    },
    handleCreate(row) {
      this.temp = {
        id: '',
        titleName: '',
        sort: '',
        isSys: ''
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteCsLabel(this.temp.id).then(() => {
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
    handleDeletes() {
      const length = this.multipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        delarr.push(this.multipleSelection[i].id)
      }
      console.log(delarr)
      deleteCsLabels(delarr).then(() => {
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteRow(row, or) {
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
    lengthUtil(value, len, va) {
      if (value === '') {
        this.tableTemp[va] = value
        return
      }
      const vals = value.replace(/\s/g, '')
      this.tableTemp[va] = vals
      if (vals.length > len) {
        this.tableTemp[va] = vals.slice(0, len)
      }
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
        this.delVisible = false
      })
    },
    statusFormat(row) {
      let vv = '-'
      const typ = this.statuss
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.status) {
          vv = aa.dictLabel
        }
      })
      return vv
    }
  }
}
</script>

<style scoped>
</style>
