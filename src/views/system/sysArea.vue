<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.areaCode"
        placeholder="请输入区域编码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.areaName"
        placeholder="请输入区域名称"
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
      <el-dropdown class="filter-item" trigger="click" placement="top">
        <el-button type="primary" class="el-dropdown-link">
          更多
          <i class="el-icon-caret-bottom" />
        </el-button>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="deleteRow('','deletes')">
              删除
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item class="custom-dropdown-menu-item">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="importFile">
              导入
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="areaCode"
      border
      :lazy="true"
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column
        prop="areaName"
        label="区域名称"
      />
      <el-table-column
        prop="areaType"
        label="区域类型"
        :formatter="menuTypeFormat"
      />
      <el-table-column
        prop="remarks"
        label="备注"
      />
      <el-table-column
        prop="treeSort"
        label="排序号"
      />

      <el-table-column
        prop="status"
        label="状态"
        :formatter="menuTypeFormat1"
      />
      <el-table-column width="130px" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-circle-plus" style="color: #409EFF;margin-left:10px;" title="新增" @click="handleCreate(scope.row)" />
          <i
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRow(scope.row,'delete')" />
          <i v-if="scope.row.status==='1'" title="禁用" class="fa fa-ban" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" title="启用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="490px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="上级区域">
          <el-tree-select ref="treeSelect" v-model="temp.parentCode" :disabled="usernameDisabled" :styles="styles" :select-params="selectParams" node-key="id" :tree-params="treeParams" :tree-render-fun="_renderFun" @searchFun="_searchFun" @node-click="_nodeClickFun" />
        </el-form-item>
        <el-form-item label="区域编号" prop="areaCode">
          <el-input v-model="temp.areaCode" placeholder="请输入区域编号" :disabled="usernameDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="区域名称" prop="areaName">
          <el-input
            v-model="temp.areaName"
            placeholder="请输入区域名称"
            :style="selectwidthz"
            @input="lengthUtil(temp.areaName,7,'areaName')"
          />
        </el-form-item>
        <el-form-item label="区域类型" prop="areaType">
          <el-select v-model="temp.areaType" placeholder="请选择区域类型" clearable class="filter-item" :style="selectwidthz">
            <el-option v-for="item in areaTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" type="textarea" placeholder="请输入备注" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="排序号" prop="treeSort">
          <el-input v-model="temp.treeSort" placeholder="请输入排序号" :style="selectwidthz" />
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

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="uploadVisible" width="300px" center>
      <el-upload
        class="upload-demo"
        :action="doUpload"
        :headers="myHeaders"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarError"
        :multiple="false"
        :limit="1"
        accept=".XLS,.XLSX,.xls,.xlsx"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传XLS/XLSX文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import {
  createSysArea,
  getSysAreaList,
  updateSysArea,
  deleteSysArea,
  getSysAreaRedisSimplifyPageList,
  deleteSysAreas,
  updateStatusById
} from '@/api/system/sysArea.js'
import { isNum } from '@/utils/validate'
import { getToken } from '@/utils/auth'
import { getDictDataList } from '@/utils/dictUtils'
export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      nodes: {},
      roww: {},
      myHeaders: {},
      doUpload: '/sysArea/import',
      uploadVisible: false,
      parentTree: [],
      dialogStatus: 'create',
      total: 0,
      delarr: [],
      dialogFormVisible: false,
      usernameDisabled: false,
      deleteor: 'delete',
      delVisible: false,
      listLoading: true,
      rowr: {},
      tableData: [{}],
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      statuss: [],
      areaTypes: [{ label: '省份直辖市', value: 'province' }, { label: '地市', value: 'city' }, { label: '区县', value: 'region' }],
      multipleSelection: [],
      listQuery: {
        current: 1,
        areaName: undefined,
        areaCode: undefined,
        parentCode: undefined
      },
      temp: {
        areaCode: undefined,
        parentCode: undefined, // 树下拉框选中数据
        treeSort: undefined,
        areaName: undefined,
        areaType: undefined, // 菜单类型来自于码表
        remarks: undefined
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      values: '',
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请输入内容'
      },
      styles: {
        width: '300px'
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
      rules: {
        areaCode: [{ required: true, message: '请输入区域编号', trigger: 'blur' }],
        treeSort: [{ required: true, message: '请输入排序', trigger: 'blur' }, { validator: isNum, trigger: 'blur' }],
        areaName: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        areaType: [{ required: true, message: '请选择区域类型', trigger: 'blur' }]
      },
      fileList: []
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '300px'
      }
    }
  },
  beforeCreate() {

  },
  created() {
    this.statuss = getDictDataList('hw_class_type_status')
    this.fetchData()
  },
  mounted() {
    const token = getToken()
    console.log(token)
    this.myHeaders = { token: token }
  },
  methods: {
    load(tree, treeNode, resolve) {
      this.listQuery.areaName = undefined
      this.listQuery.areaCode = undefined
      this.listQuery.parentCode = tree.areaCode
      this.nodes[tree.areaCode] = treeNode
      this.roww[tree.areaCode] = tree
      getSysAreaList(this.listQuery).then(response => {
        resolve(response.data.records)
      })
    },
    handleAvatarSuccess(res, file) {
      this.uploadVisible = false
      this.fileList = []
      this.fetchData()
      if (res.data) {
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      } else {
        this.$message(res.msg)
      }
    },
    handleAvatarError(res, file) {
      this.uploadVisible = false
      this.fileList = []
      this.$message('导入失败')
    },
    importFile() {
      this.uploadVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    resetTemp() {
      this.temp = {
        areaCode: undefined,
        parentCode: undefined, // 树下拉框选中数据
        treeSort: undefined,
        areaName: undefined,
        areaType: undefined, // 菜单类型来自于码表
        remarks: undefined
      }
    },
    updateStatus(row) {
      const vv = row.status === '0' ? '2' : '0'
      this.statusQueryParam.status = vv
      this.statusQueryParam.id = row.areaCode
      updateStatusById(this.statusQueryParam).then(() => {
        this.fetchData()
        const mess = vv === '0' ? '已启用' : '已停用'
        this.$message(mess)
      })
    },
    hindleChanged(val) {
      this.temp.parentCode = val[0].id
    },
    fetchData() {
      this.listLoading = true
      getSysAreaList(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    getParentTree(row) {
      getSysAreaRedisSimplifyPageList({}).then(response => {
        this.parentTree = response.data
        this.$refs.treeSelect.treeDataUpdateFun(this.parentTree)
        if (this.dialogStatus === 'create') {
          this.resetTemp()
          if (row.areaCode === undefined) {
          } else {
            this.temp.parentCode = row.areaCode
          }
        } else {
          this.parentTree.unshift({ id: '00000000', label: '首级菜单' })
          this.temp = Object.assign({}, row) // copy obj
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSysArea(this.temp).then(() => {
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
          updateSysArea(tempData).then(() => {
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
      // 重置        areaName: undefined,
      this.listQuery.areaName = undefined
      this.listQuery.areaCode = undefined
      this.listQuery.parentCode = undefined
      for (var id in this.nodes) {
        this.$refs.table.store.states.treeData[id].expanded = false
        this.$refs.table.store.states.treeData[id].loaded = false
        // this.$refs.table.$emit('expand-change', this.roww[id], false)
      }
      this.handleFilter()
    },
    handleCreate(row) {
      this.usernameDisabled = false
      this.getParentTree(row)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.getParentTree(row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleDelete() {
      if (this.rowr.hasChildren) {
        this.$message('选中当前节点有子节点,请重新选择！')
        return false
      }
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteSysArea(this.temp.areaCode).then(() => {
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
      deleteSysAreas(this.delarr).then(() => {
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
          const length = this.multipleSelection.length
          this.delarr = []
          for (let i = 0; i < length; i++) {
            if (this.multipleSelection[i].hasChildren) {
              this.$message('选中当前节点有子节点,请重新选择！')
              return false
            }
            this.delarr.push(this.multipleSelection[i].areaCode)
          }
          this.delVisible = true
        }
      }
    },
    lengthUtil(value, len, va) {
      if (value === '') {
        this.temp[va] = value
        return
      }
      const vals = value.replace(/\s/g, '')
      this.temp[va] = vals
      if (vals.length > len) {
        this.temp[va] = vals.slice(0, len)
      }
    },
    // 树点击
    _nodeClickFun(data, node, vm) {
      console.log('this _nodeClickFun', this.values, data, node)
    },
    _selectChange(val) {
      let vv = ''
      val.forEach(function(aa, bb) {
        vv = aa + ',' + vv
      })
      this.temp.moduleCodes = vv.substring(0, vv.length - 1)
      console.log(vv, '<-select change')
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
    // 自定义render
    _renderFun(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    },
    menuTypeFormat(row, type) {
      let vv = '-'
      const typ = this[type.property + 's']
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.value === row[type.property]) {
          vv = aa.label
        }
      })
      return vv
    },
    menuTypeFormat1(row, type) {
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
