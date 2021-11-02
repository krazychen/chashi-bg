<template>
  <el-row>
    <el-col :span="4"><div class="grid-content bg-purple">
      <div class="app-container">
        <el-table
          v-loading="listLoading1"
          :data="list1"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          row-key="officeCode"
        >
          <el-table-column :render-header="renderHeader" label="组织机构">
            <template slot-scope="scope">
              <span @click="findChild(scope.row)">{{ scope.row.officeName }}（{{ scope.row.officeCode }}）</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    </el-col>
    <el-col :span="20"><div class="grid-content bg-purple-light">
      <div class="app-container">
        <div class="" />
        <div class="filter-container">
          <el-input v-model="listQuery.officeName" placeholder="机构名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.officeType" placeholder="机构类型" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in officeTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
            重置
          </el-button>
<!--          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">-->
<!--            新增-->
<!--          </el-button>-->
<!--          <el-button v-waves class="filter-item" type="primary" icon="el-icon-delete" @click="handleDeletes">-->
<!--            删除-->
<!--          </el-button>-->
        </div>
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          row-key="officeCode"
          @selection-change="handleSelectionChange"
        >

          <el-table-column
            type="selection"
            label="勾选"
            width="55px"
          />
          <el-table-column
            width="200px"
            label="机构名称"
          >
            <template slot-scope="scope">
              {{ scope.row.officeName }}（{{ scope.row.officeCode }}）
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            prop="fullName"
            label="机构全称"
            align="center"
          />
          <el-table-column
            width="70px"
            prop="treeSort"
            label="排序号"
            align="center"
          />
          <el-table-column class-name="status-col" label="机构类型" width="130px" align="center" prop="officeType" :formatter="officeTypeFormat" />
          <el-table-column
            width="200px"
            prop="updateTime"
            label="更新时间"
            align="center"
          />
          <el-table-column class-name="status-col" label="状态" width="100px" align="center" prop="status" :formatter="statusFormat" />
          <el-table-column class-name="status-col" label="账户生成规则" width="100px" align="center" prop="defaultAccountRules" />
          <el-table-column
            prop="remarks"
            label="备注"
            align="center"
          />
          <el-table-column prop="address" align="center" width="180px" label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit" title="修改" tooltip="true" style="color: #67C23A;margin-left:10px;" type="primary" @click="handleUpdate(scope.row)" />
              <span v-if="scope.row.status == 1">
                <i class=" el-icon-remove" title="禁用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="statusUpdate(scope.row)" />
              </span>
              <span v-if="scope.row.status == 0">
                <i class=" el-icon-success" title="启用" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="statusUpdate(scope.row)" />
              </span>
              <i class="el-icon-delete" title="删除" tooltip="true" style="color: #F56C6C;margin-left:10px;" type="primary" @click="handleDelete(scope.row)" />
              <i class="el-icon-circle-plus" title="添加下级机构" tooltip="true" style="color: #409EFF;margin-left:10px;" @click="childCreates(scope.row.officeCode)" />
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="550px">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 450px; margin-left:50px;">
            <el-form-item label="上级机构">
              <el-tree-select ref="treeSelect" v-model="temp.parentCode" :select-params="selectParams" node-key="id" :tree-params="treeParams" :styles="styles" :tree-render-fun="_renderFun" @searchFun="_searchFun" @node-click="_nodeClickFun" />
            </el-form-item>
            <el-form-item label="机构名称" prop="officeName">
              <el-input v-model="temp.officeName" placeholder="请输入机构名称" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="机构代码" prop="viewCode">
              <el-input v-model="temp.viewCode" placeholder="请输入机构代码" :disabled="viewCodeDisabled" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="机构全称" prop="fullName">
              <el-input v-model="temp.fullName" placeholder="请输入机构全称" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="排序" prop="treeSort">
              <el-input v-model="temp.treeSort" placeholder="请输入排序" oninput="value=value.replace(/[^\d.]/g,'')" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="机构类型" prop="officeType">
              <el-select v-model="temp.officeType" placeholder="机构类型" :style="selectwidthz">
                <el-option v-for="item in officeTypes" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
              </el-select>
            </el-form-item>
            <el-form-item label="账户生成规则" prop="treeSort">
              <el-input v-model="temp.defaultAccountRules" :style="selectwidthz" />
            </el-form-item>
            <el-form-item label="备注">
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
      </div>
    </div></el-col>
  </el-row>
</template>

<script>
import { getOfficeList, createOffice, updateOffice, deleteOffice, statusUpdate, deleteOffices, getParentCodeTrees } from '@/api/system/office'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'OfficeMgn',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      styles: {
        width: '300px'
      },
      list: [],
      list1: [],
      officeTypes: [],
      statusCodes: [],
      listLoading: true,
      listLoading1: true,
      total: 0,
      flag: 0,
      office1: undefined,
      parent1: undefined,
      rowr: {},
      listQuery: {
        current: 1,
        officeCode: undefined,
        parentCode: '00000000',
        officeName: '',
        officeType: ''
      },
      temp: {
        officeCode: undefined,
        defaultAccountRules: undefined,
        multipleSelection: [],
        delarr: [],
        parentCode: '',
        parentCodes: '',
        treeSort: '',
        treeSorts: '',
        treeLeaf: '',
        treeLevel: '',
        treeNames: '',
        viewCode: '',
        officeName: '',
        fullName: '',
        officeType: '',
        leader: '',
        phone: '',
        address: '',
        zipCode: '',
        email: '',
        deleted: '',
        version: '',
        status: '',
        remarks: '',
        corpCode: '',
        corpName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      viewCodeDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
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
      stateOptions: [{
        value: '0',
        label: '禁用'
      }, {
        value: '1',
        label: '启用'
      }, {
        value: '2',
        label: '锁定'
      }],
      rules: {
        viewCode: [{ required: true, message: '请输入机构代码', trigger: 'blur' }],
        officeName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        fullName: [{ required: true, message: '请输入机构全称', trigger: 'blur' }],
        treeSort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        officeType: [{ required: true, message: '请输入机构类型', trigger: 'blur' }]
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
  beforeCreate() {
  },
  created() {
    this.statusCodes = getDictDataList('sys_status')
    this.officeTypes = getDictDataList('sys_office_type')
    this.fetchData1()
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getOfficeList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    getParentTree(row) {
      getParentCodeTrees({}).then(response => {
        this.parentTree = response.data
        // this.parentTree.unshift({ id: '00000000', label: '首级菜单' })
        this.$refs.treeSelect.treeDataUpdateFun(this.parentTree)
      })
    },
    fetchData1() {
      this.listQuery.officeCode = ''
      this.listQuery.parentCode = '00000000'// 刷新查顶级
      getOfficeList(this.listQuery).then(response => {
        this.listLoading1 = false
        this.list1 = response.data.records
      })
    },
    handleFilter() {
      if (this.flag === 1) {
        if (this.listQuery.officeName !== '' || this.listQuery.officeType !== '') {
          this.listQuery.officeCode = ''
          this.listQuery.parentCode = ''
        } else {
          this.listQuery.officeCode = this.office1
          this.listQuery.parentCode = this.parent1
        }
      }
      this.listQuery.page = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        officeCode: undefined,
        parentCode: '',
        parentCodes: '1',
        treeSort: '',
        treeSorts: '1',
        treeLeaf: '1',
        treeLevel: '1',
        treeNames: '1',
        viewCode: '',
        officeName: '',
        fullName: '',
        officeType: '',
        leader: '',
        phone: '',
        address: '',
        zipCode: '',
        email: '',
        deleted: '',
        version: '',
        status: '1',
        remarks: '',
        corpCode: '',
        corpName: ''
      }
    },
    handleCreate(row) {
      this.resetTemp()
      this.temp.parentCode = this.rowr.officeCode
      this.getParentTree(row)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.viewCodeDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createOffice(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.fetchData()
            this.fetchData1()
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
      if (row.status !== '0') {
        this.$message.error('只有禁用状态的机构才允许编辑！')
        return false
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.viewCodeDisabled = true

      this.getParentTree(row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          updateOffice(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.fetchData()
            this.fetchData1()
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
    statusUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      statusUpdate(this.temp.officeCode).then(() => {
        this.fetchData()
        this.fetchData1()
        this.$notify({
          title: '成功',
          message: '状态修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.temp = Object.assign({}, row) // copy obj
      deleteOffice(this.temp.officeCode).then(() => {
        this.fetchData()
        this.fetchData1()
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
      this.temp.delarr = []
      for (let i = 0; i < length; i++) {
        if (this.multipleSelection[i].children.length > 0) {
          this.$message('选中当前节点有子节点,请重新选择！')
          return false
        }
        this.temp.delarr.push(this.multipleSelection[i].officeCode)
      }
      deleteOffices(this.temp.delarr).then(() => {
        this.fetchData()
        this.fetchData1()
        this.$notify({
          title: '成功',
          message: '批量删除成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    childCreates(officeCode) {
      this.resetTemp()
      this.temp.parentCode = officeCode
      this.dialogStatus = 'create'
      this.viewCodeDisabled = false
      this.dialogFormVisible = true
      this.getParentTree()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    rest() {
      this.listQuery.officeName = ''
      this.listQuery.officeType = ''
    },
    findChild(row) {
      this.rowr = row
      this.listQuery.officeCode = row.officeCode
      this.listQuery.parentCode = row.parentCode
      this.office1 = row.officeCode
      this.parent1 = row.parentCode
      this.flag = 1
      this.fetchData()
    },
    refresh() {
      this.listLoading1 = true
      this.fetchData1()
    },
    officeTypeFormat(row) {
      let vv = '-'
      const typ = this.officeTypes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.officeType) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    statusFormat(row) {
      let vv = '-'
      const typ = this.statusCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.status) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    renderHeader(h, { column }) { // h即为cerateElement的简写
      return h(
        'div',
        [
          h('span', column.label),
          h('i', {
            class: 'el-icon-refresh',
            style: 'color: #2df5b7;margin-left:10px;',
            on: {
              click: () => {
                this.refresh()
              }
            }
          })
        ],
      )
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
    // 自定义render
    _renderFun(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{node.label}</span>
        </span>
      )
    }
  }
}
</script>
