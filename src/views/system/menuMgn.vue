<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.menuName" placeholder="菜单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.menuType" placeholder="菜单类型" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in menuTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 110px" class="filter-item">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
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
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单编码" width="95">
        <template slot-scope="scope">
          {{ scope.row.menuCode }}
        </template>
      </el-table-column>
      <el-table-column label="父级编号">
        <template slot-scope="scope">
          {{ scope.row.parentCode }}
        </template>
      </el-table-column>
      <el-table-column label="所有父级编号">
        <template slot-scope="scope">
          {{ scope.row.parentCodes }}
        </template>
      </el-table-column>
      <el-table-column label="是否最末级">
        <template slot-scope="scope">
          {{ scope.row.treeLeaf }}
        </template>
      </el-table-column>
      <el-table-column label="全节点名">
        <template slot-scope="scope">
          {{ scope.row.treeNames }}
        </template>
      </el-table-column>
      <el-table-column label="菜单名称">
        <template slot-scope="scope">
          {{ scope.row.menuName }}
        </template>
      </el-table-column>
      <el-table-column label="链接">
        <template slot-scope="scope">
          {{ scope.row.menuHref }}
        </template>
      </el-table-column>
      <el-table-column label="目标">
        <template slot-scope="scope">
          {{ scope.row.menuTarget }}
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          {{ scope.row.menuIcon }}
        </template>
      </el-table-column>
      <el-table-column label="颜色">
        <template slot-scope="scope">
          {{ scope.row.menuColor }}
        </template>
      </el-table-column>
      <el-table-column label="菜单标题">
        <template slot-scope="scope">
          {{ scope.row.menuTitle }}
        </template>
      </el-table-column>
      <el-table-column label="菜单类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.menuType | menuTypeFilter">{{ scope.row.menuType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | stateFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createDate }}</span>
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
        <el-form-item label="菜单编码" prop="menuCode">
          <el-input v-model="temp.menuCode" placeholder="请输入菜单编码" :disabled="menuCodeDisabled" />
        </el-form-item>
        <el-form-item label="父级编码" prop="parentCode">
          <el-input v-model="temp.parentCode" placeholder="请输入父级编码" />
        </el-form-item>
        <el-form-item label="是否最末级" prop="treeLeaf">
          <el-input v-model="temp.treeLeaf" placeholder="是否最末级" />
        </el-form-item>
        <el-form-item label="全节点名" prop="treeNames">
          <el-input v-model="temp.treeNames" placeholder="请输入全节点名" />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="temp.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="链接" prop="menuHref">
          <el-input v-model="temp.menuHref" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="目标" prop="menuTarget">
          <el-input v-model="temp.menuTarget" placeholder="请输入目标" />
        </el-form-item>
        <el-form-item label="菜单标题" prop="menuTitle">
          <el-input v-model="temp.menuTitle" placeholder="请输入菜单标题" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="temp.menuType" placeholder="请选择菜单类型" clearable style="width: 90px" class="filter-item">
            <el-option v-for="item in menuTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
import { getPageList, createMenu, updateMenu, deleteMenu } from '@/api/system/menu'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'MenuMgn',
  components: { Pagination },
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
    menuTypeFilter(menuType) {
      const typeMap = {
        1: 'success',
        2: 'gray',
        0: 'danger'
      }
      return typeMap[menuType]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        menuName: undefined,
        menuType: undefined,
        status: undefined
      },
      temp: {
        menuCode: undefined,
        parentCode: '',
        parentCodes: '',
        treeLeaf: '',
        treeNames: '',
        menuHref: '',
        menuTarget: '',
        menuIcon: '',
        menuColor: '',
        menuTitle: '',
        createDate: '',
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      menuCodeDisabled: false,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      menuTypes: [{
        value: 1,
        label: '菜单'
      }, {
        value: 2,
        label: '权限'
      }, {
        value: 3,
        label: '开发'
      }],
      stateOptions: [{
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '删除'
      }, {
        value: 2,
        label: '停用'
      }],
      rules: {
        menuName: [{ required: true, message: '请输入菜单名', trigger: 'blur' }],
        menuTitle: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择菜单状态', trigger: 'change' }]
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
      getPageList(this.listQuery).then(response => {
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
        menuCode: undefined,
        parentCode: '',
        parentCodes: '',
        treeLeaf: '',
        treeNames: '',
        menuHref: '',
        menuTarget: '',
        menuIcon: '',
        menuColor: '',
        menuTitle: '',
        createDate: new Date(),
        status: 0,
        treeSort: 0,
        treeSorts: 0,
        treeLevel: 0,
        isShow: 0,
        sysCode: 0,
        moduleCodes: 0,
        createBy: 'admin',
        updateBy: '123',
        updateDate: new Date()

      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.menuCodeDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createMenu(this.temp).then(() => {
            this.list.unshift(this.temp)
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
      this.menuCodeDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.createTime = undefined
          tempData.version = undefined
          tempData.deleted = undefined
          console.log(tempData)
          updateMenu(tempData).then(() => {
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
      deleteMenu(this.temp.menuCode).then(() => {
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
