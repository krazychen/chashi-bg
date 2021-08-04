<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input
        v-model="listQuery.menuName"
        placeholder="请输入菜单名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.permission"
        placeholder="请输入菜单标识"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.menuType" placeholder="菜单类型" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in menuTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.moduleCodes" placeholder="归属模块" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in moduleCodess" :key="item.value" :label="item.label" :value="item.value" />
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
      row-key="menuCode"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column
        prop="menuName"
        label="菜单名称"
      />
      <el-table-column
        prop="moduleCodes"
        label="归属模块"
        :formatter="menuModuleCodesFormat"
      />
      <el-table-column
        prop="menuHref"
        label="链接"
      />
      <el-table-column
        prop="treeSort"
        label="排序"
      />
      <el-table-column
        prop="menuType"
        label="类型"
        :formatter="menuTypeFormat"
      />
      <el-table-column
        prop="isShow"
        label="可见"
        :formatter="menuIsShowFormat"
      />
      <el-table-column
        prop="permission"
        label="权限标识"
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="temp.menuName"
            placeholder="请输入名称"
            :style="selectwidthz"
            @input="lengthUtil(temp.menuName,50,'menuName')"
          />
        </el-form-item>
        <el-form-item label="菜单编号" prop="menuCode">
          <el-input v-model="temp.menuCode" placeholder="请输入菜单编号" :disabled="usernameDisabled" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="父级菜单">
          <el-tree-select ref="treeSelect" v-model="temp.parentCode" :style="selectwidthz" :select-params="selectParams" node-key="id" :tree-params="treeParams" :tree-render-fun="_renderFun" @searchFun="_searchFun" @node-click="_nodeClickFun" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="temp.menuType" placeholder="请选择菜单类型" clearable class="filter-item" :style="selectwidthz">
            <el-option v-for="item in menuTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属系统" prop="sysCode">
          <el-select v-model="temp.sysCode" class="filter-item" placeholder="请选择归属系统" :style="selectwidthz">
            <el-option v-for="item in sysCodes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属模块" prop="moduleCodes">
          <el-select v-model="moduleCodesval" multiple collapse-tags class="filter-item" placeholder="请选择所属模块" :style="selectwidthz" @change="_selectChange">
            <el-option v-for="item in moduleCodess" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限" prop="permission">
          <el-input v-model="temp.permission" placeholder="请输入链接" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="目标" prop="menuTarget">
          <el-input v-model="temp.menuTarget" placeholder="请输入目标" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="排序" prop="treeSort">
          <el-input v-model="temp.treeSort" placeholder="请输入菜单排序" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="链接" prop="menuHref">
          <el-input v-model="temp.menuHref" placeholder="请输入链接" :style="selectwidthz" />
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-select v-model="temp.isShow" class="filter-item" placeholder="请选择菜单类型" :style="selectwidthz">
            <el-option v-for="item in isShows" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.menuType=='1'" label="菜单标题" prop="menuTitle">
          <el-input v-model="temp.menuTitle" placeholder="请输入链接" :style="selectwidthz" />
        </el-form-item>
        <el-form-item v-if="temp.menuType=='1'" label="图标" prop="menuIcon">
          <icon-picker v-model="temp.menuIcon" :style="selectwidthz" />
        </el-form-item>
        <el-form-item v-if="temp.menuType=='1'" label="字体颜色" prop="menuColor">
          <el-color-picker v-model="temp.menuColor" :style="selectwidthz" />
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
import {
  createSysMenu,
  getSysMenuList,
  updateSysMenu,
  deleteSysMenu,
  getSysMenuSimplifyPageList,
  deleteMenus
} from '@/api/system/sysMenu.js'
import { isNum, isHref, isPermission } from '@/utils/validate'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      parentTree: [],
      dialogStatus: 'create',
      total: 0,
      dialogFormVisible: false,
      usernameDisabled: false,
      deleteor: 'delete',
      delVisible: false,
      listLoading: true,
      rowr: {},
      tableData: [{}],
      moduleCodess: [{ label: '平台管理', value: '1' }, { label: '商家管理', value: '2' }],
      menuTypes: [{ label: '菜单', value: '1' }, { label: '权限', value: '2' }],
      isShows: [{ label: '否', value: '0' }, { label: '是', value: '1' }],
      sysCodes: [{ label: '后台管理系统', value: '1' }, { label: '小程序', value: '2' }],
      moduleCodesval: [],
      multipleSelection: [],
      listQuery: {
        current: 1,
        menuName: undefined,
        menuType: undefined,
        moduleCodes: '',
        permission: undefined
      },
      temp: {
        menuCode: '',
        parentCode: '', // 树下拉框选中数据
        moduleCodes: '',
        treeSort: '',
        menuName: '',
        menuType: '1', // 菜单类型来自于码表
        menuHref: '',
        menuTarget: '',
        menuIcon: '',
        menuColor: '#409EFF',
        menuTitle: '',
        permission: '',
        sysCode: '',
        remarks: '',
        isShow: ''
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
        menuCode: [{ required: true, message: '请输入菜单编号', trigger: 'blur' }],
        treeSort: [{ required: true, message: '请输入排序' }, { validator: isNum, trigger: 'submit' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
        menuHref: [{ validator: isHref, trigger: 'blur' }],
        menuTarget: [{ required: false, message: '请输入目标', trigger: 'blur' }],
        permission: [{ validator: isPermission, trigger: 'blur' }],
        sysCode: [{ required: true, message: '请选择归属系统', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
        isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }]
      }
    }
  },
  computed: {
    selectwidthz() {
      return {
        width: '185px'
      }
    }
  },
  beforeCreate() {

  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    hindleChanged(val) {
      this.temp.parentCode = val[0].id
    },
    fetchData() {
      this.listLoading = true
      getSysMenuList(this.listQuery).then(response => {
        console.log(response.data)
        this.tableData = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
    },
    getParentTree(row) {
      getSysMenuSimplifyPageList({}).then(response => {
        this.parentTree = response.data
        this.$refs.treeSelect.treeDataUpdateFun(this.parentTree)
        this.moduleCodesval = []
        if (this.dialogStatus === 'create') {
          this.temp = {
            menuCode: '',
            parentCode: '', // 树下拉框选中数据
            moduleCodes: '',
            treeSort: '',
            menuName: '',
            menuType: '1', // 菜单类型来自于码表
            menuHref: '',
            menuTarget: '',
            menuIcon: '',
            menuColor: '#409EFF',
            menuTitle: '',
            permission: '',
            sysCode: '',
            remarks: '',
            isShow: ''
          }
          if (row.menuCode === undefined) {
          } else {
            this.temp.parentCode = row.menuCode
          }
        } else {
          const vv = row.moduleCodes
          if (vv !== undefined && vv !== '') {
            this.moduleCodesval = vv.split(',')
          }
          this.parentTree.unshift({ id: '00000000', label: '首级菜单' })
          this.temp = Object.assign({}, row) // copy obj
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSysMenu(this.temp).then(() => {
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
          updateSysMenu(tempData).then(() => {
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
      this.listQuery.menuName = undefined
      this.listQuery.menuType = undefined
      this.listQuery.moduleCodes = undefined
      this.listQuery.permission = undefined
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
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteSysMenu(this.temp.menuCode).then(() => {
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
        if (this.multipleSelection[i].children.length > 0) {
          this.$message('选中当前节点有子节点,请重新选择！')
          return false
        }
        delarr.push(this.multipleSelection[i].menuCode)
      }
      console.log(delarr)
      deleteMenus(delarr).then(() => {
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
    menuTypeFormat(row) {
      let vv = '-'
      const typ = this.menuTypes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.value === row.menuType) {
          vv = aa.label
        }
      })
      return vv
    },
    menuModuleCodesFormat(row) {
      let vv = '-'
      const typ = this.moduleCodess
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      if (row.moduleCodes !== undefined && row.moduleCodes !== '') {
        const rovals = row.moduleCodes.split(',')
        typ.forEach(function(aa, bb) {
          rovals.forEach(function(cc, dd) {
            if (aa.value === cc) {
              vv = aa.label + ',' + vv
            }
          })
        })
      }
      vv = vv.substring(0, vv.length - 2)
      return vv
    },
    menuIsShowFormat(row) {
      let vv = '-'
      const typ = this.isShows
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.value === row.isShow) {
          vv = aa.label
        }
      })
      return vv
    }
  }
}
</script>

<style scoped>

</style>
