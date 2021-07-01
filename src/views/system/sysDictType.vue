<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.dictName"
        placeholder="请输入字典名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.dictType"
        placeholder="请输入字典类型"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.remarks"
        placeholder="请输入备注信息"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.status" placeholder="字典状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in statuss" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
        prop="dictName"
        label="字典名称"
      />
      <el-table-column
        prop="id"
        label="字典编码"
      />
      <el-table-column
        prop="dictType"
        label="字典类型"
      />
      <el-table-column
        prop="isSys"
        label="系统字典"
        :formatter="menuIsSysFormat"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
      />
      <el-table-column
        prop="remarks"
        label="备注"
      />
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormat"
      />
      <el-table-column width="130px" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-circle-plus" style="color: #409EFF;margin-left:10px;" title="新增字典值" @click="tablehandleCreate(scope.row)" />
          <i
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateStatus(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateStatus(scope.row)" />
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
        <el-form-item label="字典名称" prop="dictName">
          <el-input
            v-model="temp.dictName"
            placeholder="请输入字典名称"
            @input="lengthUtil(temp.dictName,7,'dictName')"
          />
        </el-form-item>
        <el-form-item label="字典编码" prop="id">
          <el-input v-model="temp.id" placeholder="请输入字典编号" :disabled="usernameDisabled" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="temp.dictType" placeholder="请输入字典类型" :disabled="usernameDisabled" />
        </el-form-item>
        <el-form-item label="系统字典" prop="isSys">
          <el-radio-group v-model="temp.isSys" :style="selectwidthz">
            <el-radio v-for="item in isSyss" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="temp.remarks" type="textarea" placeholder="请输入备注信息" />
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

    <el-dialog :title="textMap[tableDialogStatus]" :visible.sync="tableDialogFormVisible" width="530px">
      <el-form ref="dataForms" :rules="tableRules" :model="tableTemp" label-position="left" label-width="90px" style="width: 390px; margin-left:50px;">
        <el-form-item label="父级标签">
          <el-tree-select ref="treeSelect" v-model="tableTemp.parentCode" :styles="styles" :disabled="exhibition" :select-params="selectParams" node-key="id" :tree-params="treeParams" :tree-render-fun="_renderFun" @searchFun="_searchFun" @node-click="_nodeClickFun" />
        </el-form-item>
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="tableTemp.dictLabel" placeholder="请输入字典标签" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="tableTemp.dictValue" placeholder="请输入值字典键值" />
        </el-form-item>
        <el-form-item label="排序号" prop="treeSort">
          <el-input
            v-model="tableTemp.treeSort"
            placeholder="请输入排序号"
          />
        </el-form-item>
        <el-form-item label="是否系统" prop="isSys">
          <el-radio-group v-model="tableTemp.isSys" :style="selectwidthz">
            <el-radio v-for="item in isSyss" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="tableTemp.remarks" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tableDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="tableDialogStatus==='create'?tableCreateData():tableUpdateData()">
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
    <el-dialog title="提示" :visible.sync="tableDelVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tableDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="tableDeleteor==='delete'?tableHandleDelete():tableHandleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="字典信息" :visible.sync="tableVisible" width="1000px">
      <div class="app-container">
        <el-input
          v-model="tableListQuery.dictLabel"
          placeholder="请输入字典标签"
          style="width: 150px;"
          class="filter-item"
          size="small"
          @keyup.enter.native="tableHandleFilter"
        />
        <el-input
          v-model="tableListQuery.dictValue"
          placeholder="请输入字典键值"
          style="width: 150px;"
          class="filter-item"
          size="small"
          @keyup.enter.native="tableHandleFilter"
        />
        <el-select v-model="tableListQuery.status" placeholder="状态" clearable style="width: 100px" class="filter-item" size="small">
          <el-option v-for="item in statuss" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="tableHandleFilter">
          查询
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          size="small"
          @click="tableNewHandleCreate"
        >
          新增
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" size="small" @click="tableResetFilter">
          重置
        </el-button>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" size="small" @click="tableDeleteRow('','deletes')">
          删除
        </el-button>
        <div class="filter-container" />
        <el-table
          v-loading="tablelistLoading"
          :data="tableTableData"
          row-key="dictCode"
          style="width: 100%;margin-bottom: 20px;"
          @selection-change="tableHandleSelectionChange"
        >
          <el-table-column
            type="selection"
            label="勾选"
            width="55"
          />
          <el-table-column
            prop="dictLabel"
            label="字典标签"
          />
          <el-table-column
            prop="dictValue"
            label="字典键值"
          />
          <el-table-column
            prop="treeSort"
            label="排序号"
          />
          <el-table-column
            prop="isSys"
            label="系统内置"
            :formatter="menuIsSysFormat"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="200"
          />
          <el-table-column
            prop="remarks"
            label="备注"
          />
          <el-table-column
            prop="status"
            label="状态"
            :formatter="statusFormat"
          />
          <el-table-column width="130px" label="操作">
            <template slot-scope="scope">
              <i class="el-icon-circle-plus" style="color: #409EFF;margin-left:10px;" title="新增" @click="tableThandleCreate(scope.row)" />
              <i
                class="el-icon-edit"
                style="color: #67C23A;margin-left:10px;"
                type="primary"
                title="编辑"
                @click="tableHandleUpdate(scope.row)"
              />
              <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="tableDeleteRow(scope.row,'delete')" />
              <i v-if="scope.row.status==='1'" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="tableUpdateStatus(scope.row)" />
              <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="tableUpdateStatus(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="tableTotal>0"
          :total="tableTotal"
          :page.sync="tableListQuery.current"
          :limit.sync="tableListQuery.size"
          @pagination="tableFetchData(this.thisdictCode)"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves'
import { isNum } from '@/utils/validate'
import { getDictDataList } from '@/utils/dictUtils'
import {
  createSysDictType,
  getSysDictTypeList,
  updateSysDictType,
  deleteSysDictType,
  deleteSysDictTypes,
  updateStatusById
} from '@/api/system/sysDictType.js'

import {
  createSysDictData,
  getSysDictDataList,
  updateSysDictData,
  deleteSysDictData,
  getSysMenuSimplifyPageList,
  deleteSysDictDatas,
  updateStatusDataById
} from '@/api/system/SysDictData.js'
export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      styles: {
        width: '300px'
      },
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请输入内容'
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
      exhibition: false,
      tableVisible: false,
      parentTree: [],
      dialogStatus: 'create',
      tableDialogStatus: 'create',
      total: 0,
      dialogFormVisible: false,
      tableDialogFormVisible: false,
      usernameDisabled: false,
      deleteor: 'delete',
      tableDeleteor: 'delete',
      delVisible: false,
      tableDelVisible: false,
      listLoading: true,
      tablelistLoading: true,
      parentCodes: [{}],
      rowr: {},
      tableRowr: {},
      tableData: [{}],
      statuss: [],
      isSyss: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
      multipleSelection: [],
      tableMultipleSelection: [],
      thisdictCode: '',
      tableTemp: {
        dictCode: '',
        treeSort: '',
        parentCode: '',
        dictLabel: '',
        dictValue: '1', // 菜单类型来自于码表
        isSys: '',
        description: ''
      },
      tableTableData: [],
      tableTotal: 0,
      tableListQuery: {
        current: 1,
        dictLabel: '',
        status: '',
        dictValue: '',
        dictType: ''
      },
      listQuery: {
        current: 1,
        dictName: undefined,
        dictType: undefined,
        status: undefined,
        remarks: undefined
      },
      statusQueryParam: {
        id: undefined,
        status: undefined
      },
      temp: {
        id: '',
        dictName: '',
        dictType: '', // 菜单类型来自于码表
        remarks: '',
        isSys: ''
      },
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        id: [{ required: true, message: '请输入字典编号', trigger: 'blur' }],
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictType: [{ required: true, message: '请选择字典类型', trigger: 'change' }],
        isSys: [{ required: true, message: '请选择是否系统内置', trigger: 'blur' }]
      },
      tableRules: {
        dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
        dictValue: [{ required: true, message: '请输入字典键值', trigger: 'change' }],
        isSys: [{ required: true, message: '请选择是否系统内置', trigger: 'blur' }],
        treeSort: [{ required: true, message: '请输入排序号', trigger: 'blur' }, { validator: isNum, trigger: 'submit' }]
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
    hindleChanged(val) {
      this.temp.parentCode = val[0].id
    },
    fetchData() {
      this.listLoading = true
      getSysDictTypeList(this.listQuery).then(response => {
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    tableFetchData(dictType) {
      this.tableVisible = true
      this.tablelistLoading = true
      this.tableListQuery.dictType = dictType
      getSysDictDataList(this.tableListQuery).then(response => {
        this.tableTableData = response.data.records
        this.tableTotal = parseInt(response.data.total)
        this.tablelistLoading = false
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSysDictType(this.temp).then(() => {
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
    tableCreateData() {
      this.$refs['dataForms'].validate((valid) => {
        this.tableTemp.dictType = this.thisdictCode
        if (valid) {
          createSysDictData(this.tableTemp).then(() => {
            // this.list.unshift(this.temp)
            this.tableFetchData(this.thisdictCode)
            this.tableDialogFormVisible = false
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
          updateSysDictType(tempData).then(() => {
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
    tableUpdateData() {
      this.$refs['dataForms'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tableTemp)
          updateSysDictData(tempData).then(() => {
            this.tableFetchData(this.thisdictCode)
            this.tableDialogFormVisible = false
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
    tableHandleFilter() {
      this.tableListQuery.page = 1
      this.tableFetchData(this.thisdictCode)
    },
    resetFilter() {
      // 重置
      this.listQuery.dictType = undefined
      this.listQuery.status = undefined
      this.listQuery.dictName = undefined
      this.listQuery.remarks = undefined
      this.handleFilter()
    },
    tableResetFilter() {
      // 重置
      this.tableListQuery.dictType = undefined
      this.tableListQuery.dictLabel = undefined
      this.tableListQuery.dictValue = undefined
      this.tableListQuery.status = undefined
      this.tableHandleFilter()
    },
    tablehandleCreate(row) {
      this.thisdictCode = row.dictType
      this.tableFetchData(this.thisdictCode)
    },
    tableThandleCreate(row) { // 用于打开新增
      this.exhibition = false
      this.getParentTree(row)
      this.tableDialogStatus = 'create'
      this.tableDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForms'].clearValidate()
      })
    },
    handleCreate(row) {
      this.temp = {
        id: '',
        dictName: '',
        dictType: '', // 菜单类型来自于码表
        remarks: '',
        isSys: ''
      }
      this.usernameDisabled = false
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    tableNewHandleCreate(row) {
      this.exhibition = false
      this.getParentTree(row)
      this.tableDialogStatus = 'create'
      this.tableDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForms'].clearValidate()
      })
    },
    getParentTree(row) {
      this.tableListQuery.dictType = this.thisdictCode
      getSysMenuSimplifyPageList(this.tableListQuery).then(response => {
        this.parentTree = response.data
        this.$refs.treeSelect.treeDataUpdateFun(this.parentTree)
        // this.moduleCodesval = []
        if (this.tableDialogStatus === 'create') {
          this.tableTemp = {
            dictCode: '',
            treeSort: '',
            parentCode: '',
            dictLabel: '',
            dictValue: '1', // 菜单类型来自于码表
            isSys: '',
            description: ''
          }
          // eslint-disable-next-line no-empty
          if (row.dictCode === undefined) {
          } else {
            this.tableTemp.parentCode = row.dictCode
          }
        } else {
          this.parentTree.unshift({ id: '00000000', label: '首级菜单' })
          this.tableTemp = Object.assign({}, row) // copy obj
        }
      })
    }, // 树点击
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
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.usernameDisabled = true
      this.temp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    tableHandleUpdate(row) {
      this.tableDialogStatus = 'update'
      this.tableDialogFormVisible = true
      this.exhibition = true
      this.tableTemp = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForms'].clearValidate()
      })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteSysDictType(this.temp.id).then(() => {
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
    tableHandleDelete() {
      this.tableTemp = Object.assign({}, this.tableRowr) // copy obj
      deleteSysDictData(this.tableTemp.dictCode).then(() => {
        this.tableFetchData(this.tableRowr.dictType)
        this.tableDelVisible = false
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
      deleteSysDictTypes(delarr).then(() => {
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
    tableHandleDeletes() {
      const length = this.tableMultipleSelection.length
      const delarr = []
      for (let i = 0; i < length; i++) {
        if (this.tableMultipleSelection[i].children.length > 0) {
          this.$message('选中当前节点有子节点,请重新选择！')
          return false
        }
        delarr.push(this.tableMultipleSelection[i].dictCode)
      }
      console.log(delarr)
      deleteSysDictDatas(delarr).then(() => {
        this.tableFetchData(this.thisdictCode)
        this.tableDelVisible = false
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
    tableHandleSelectionChange(val) {
      this.tableMultipleSelection = val
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
    tableDeleteRow(row, or) {
      this.tableDeleteor = or
      if (this.tableDeleteor === 'delete') {
        this.tableRowr = row
        this.tableDelVisible = true
      } else {
        if (this.tableMultipleSelection.length < 1) {
          this.$message('请勾选要删除的项！')
        } else {
          this.tableDelVisible = true
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
    tableUpdateStatus(row) {
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
      this.statusQueryParam.id = row.dictCode
      updateStatusDataById(this.statusQueryParam).then(() => {
        this.tableFetchData(this.thisdictCode)
        // const mess = vv === '0' ? '已启用' : '已停用'
        this.$message(msg)
        this.delVisible = false
      })
    },
    menuIsSysFormat(row) {
      let vv = '-'
      const typ = this.isSyss
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.value === row.isSys) {
          vv = aa.label
        }
      })
      return vv
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
