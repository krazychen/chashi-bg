<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="请输入角色名称" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.code" placeholder="请输入角色编码" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.remark" placeholder="请输入备注" style="width: 200px;" class="filter-item" />
      <el-select v-model="listQuery.type" placeholder="请选择角色类型" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-button v-waves class="filter-item" type="primary" icon="fa fa-chevron-circle-right" @click="relationUserpl()">
        分配用户
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <!--      <el-table-column align="center" label="序号">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>-->
      <el-table-column label="角色名称" prop="name" />
      <el-table-column label="角色编码" prop="code" />
      <!--      <el-table-column label="排序号">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>-->
      <!--      <el-table-column label="系统角色" prop="code" />-->
      <el-table-column label="角色类型" prop="type" :formatter="typeIsSysFormat" />
      <!--<el-table-column label="更新时间" prop="updateTime" />-->
      <el-table-column label="备注" prop="remark" />
      <!--      <el-table-column label="角色类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>-->
      <el-table-column class-name="status-col" label="状态" align="center" prop="state" :formatter="stateIsSysFormat" />
      <el-table-column width="200px" label="操作" align="center">
        <template slot-scope="scope">
          <i
            class="el-icon-edit"
            style="color: #67C23A;margin-left:10px;"
            type="primary"
            title="编辑"
            @click="handleUpdate(scope.row)"
          />
          <i class="el-icon-delete" style="color: #F56C6C;margin-left:10px;" title="删除" @click="deleteRow(scope.row,'delete')" />
          <i v-if="scope.row.state===1" class="fa fa-ban" title="禁用" style="color: #F56C6C;margin-left:10px;" @click="updateState(scope.row)" />
          <i v-else class="fa fa-power-off" style="color: #F56C6C;margin-left:10px;" title="启用" @click="updateState(scope.row)" />
          <i class="fa fa-chevron-circle-right" style="color: #409EFF;margin-left:10px;" title="分配菜单" @click="relationMenus(scope.row)" />
          <i class="el-icon-user-solid" style="color: #F56C6C;margin-left:10px;" title="分配用户" @click="relationUser(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="490px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="请输入角色名称"
            :style="selectwidthz"
            @input="lengthUtil(temp.name,7,'name')"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="temp.code" placeholder="请输入角色编码" :style="selectwidthz" :disabled="codeDisabled" />
        </el-form-item>
        <el-form-item label="角色类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择角色类型" clearable class="filter-item" :style="selectwidthz">
            <el-option v-for="item in types" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea" placeholder="请输入角色编码" :style="selectwidthz" />
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
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteor==='delete'?handleDelete():handleDeletes()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <!--    <el-dialog v-loading="listLoadingMenu" title="分配菜单" :visible.sync="addVisibleMenu" width="300px" center>
      <el-tree
        ref="tree"
        :data="datas"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :props="props"
        :default-checked-keys="checkedkeys"
        :check-strictly="true"
        @node-collapse="nodecollapse"
        @node-expand="nodeexpand"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="getCheckedNodes">
          确定
        </el-button>
      </div>
    </el-dialog>-->
    <el-dialog v-loading="listLoadingMenu" title="分配菜单" :visible.sync="addVisibleMenu" width="660px">
      <div class="el-dialog-div">
        <el-tree
          ref="tree"
          :data="datas"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :check-on-click-node="true"
          :props="props"
          :default-checked-keys="checkedkeys"
          :check-strictly="true"
          @node-collapse="nodecollapse"
          @node-expand="nodeexpand"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <i v-if="data.children.length<1" :class="tubiao[1]"><span style="margin-left:10px;">{{ node.label }}</span></i>
            <i v-else-if="panduan!=='0' && idd[node.data.id]!==undefined" :class="tubiao[2]"><span style="margin-left:10px;">{{ node.label }}</span></i>
            <i v-else :class="tubiao[0]"><span style="margin-left:10px;">{{ node.label }}</span></i>
            <span>
              <span>{{ data.menuHref }}</span>
            </span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleMenu = false">
          取消
        </el-button>
        <el-button type="primary" @click="getCheckedNodes">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="关联用户" :visible.sync="userVisible" width="1200px" center>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="已选用户" name="first" />
        <el-tab-pane label="全部用户" name="second" />
      </el-tabs>
      <el-row>
        <el-col :span="sizeone">
          <div class="app-container">
            <div class="filter-container">
              <el-input v-model="listQueryUser.username" placeholder="用户名" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-input v-model="listQueryUser.nickname" placeholder="昵称" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-input v-model="listQueryUser.phone" placeholder="手机号" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-select v-model="listQueryUser.state" placeholder="状态" size="small" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilterUser">
                查询
              </el-button>
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-refresh" @click="restUser">
                重置
              </el-button>
            </div>
            <div class="el-dialog-div">
              <el-table
                ref="multipleTable"
                v-loading="listLoadingUser"
                :data="listuser"
                element-loading-text="Loading"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                :row-key="getRowKeysecond"
                @selection-change="selectionChangeUser"
              >
                <el-table-column
                  type="selection"
                  label="勾选"
                  :reserve-selection="true"
                  width="40px"
                />
                <el-table-column align="center" label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index }}
                  </template>
                </el-table-column>
                <el-table-column align="center" label="用户名">
                  <template slot-scope="scope">
                    {{ scope.row.username }}
                  </template>
                </el-table-column>
                <el-table-column label="昵称">
                  <template slot-scope="scope">
                    {{ scope.row.nickname }}
                  </template>
                </el-table-column>
                <el-table-column label="电子邮箱">
                  <template slot-scope="scope">
                    {{ scope.row.email }}
                  </template>
                </el-table-column>
                <el-table-column label="电话" align="center">
                  <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                  </template>
                </el-table-column>
                <el-table-column class-name="status-col" label="状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.state == 0">禁用</span>
                    <span v-if="scope.row.state == 1">启用</span>
                    <span v-if="scope.row.state == 2">锁定</span>
                  </template>
                </el-table-column>

                <el-table-column v-if="activeName==='first'" label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <i class="fa fa-remove" style="color: #409EFF;margin-left:10px;" title="删除" type="primary" @click="deleteSysUserRole(scope.row)" />
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="totalUser>0" :total="totalUser" :page.sync="listQueryUser.current" :limit.sync="listQueryUser.size" @pagination="fetchDataUser" />
            </div>
          </div>
        </el-col>
        <el-col :span="sizetwo">
          <div class="app-container">
            <div class="filter-container">
              <el-button type="primary" size="mini" @click="submitRoleAndMenu">提交</el-button>
            </div>
            <div class="el-dialog-div">
              <el-tag
                v-for="tag in tags"
                :key="tag.username"
                closable
                size="mini"
                :type="tag.type"
                @close="handleClose(tag)"
              >
                {{ tag.username }}
              </el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="关联用户" :visible.sync="userVisiblepl" center>
      <el-row>
        <el-col :span="18">
          <div class="app-container">
            <div class="filter-container">
              <el-input v-model="listQueryUserpl.username" placeholder="用户名" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-input v-model="listQueryUserpl.nickname" placeholder="昵称" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-input v-model="listQueryUserpl.phone" placeholder="手机号" size="small" style="width: 110px;" class="filter-item" @keyup.enter.native="handleFilter" />
              <el-select v-model="listQueryUserpl.state" placeholder="状态" size="small" clearable style="width: 110px" class="filter-item">
                <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-search" @click="handleFilterUserpl">
                查询
              </el-button>
              <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-refresh" @click="restUserpl">
                重置
              </el-button>
            </div>
            <el-table
              ref="multipleTablepl"
              v-loading="listLoadingUserpl"
              :data="listuserpl"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
              style="width: 100%;"
              row-key="id"
              @selection-change="selectionChangeUserpl"
            >
              <el-table-column
                type="selection"
                label="勾选"
                width="40px"
              />
              <el-table-column align="center" label="序号">
                <template slot-scope="scope">
                  {{ scope.$index }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="用户名">
                <template slot-scope="scope">
                  {{ scope.row.username }}
                </template>
              </el-table-column>
              <el-table-column label="昵称">
                <template slot-scope="scope">
                  {{ scope.row.nickname }}
                </template>
              </el-table-column>
              <el-table-column label="电子邮箱">
                <template slot-scope="scope">
                  {{ scope.row.email }}
                </template>
              </el-table-column>
              <el-table-column label="电话" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.phone }}</span>
                </template>
              </el-table-column>
              <el-table-column class-name="status-col" label="状态" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.state == 0">禁用</span>
                  <span v-if="scope.row.state == 1">启用</span>
                  <span v-if="scope.row.state == 2">锁定</span>
                </template>
              </el-table-column>
            </el-table>

            <pagination v-show="totalUserpl>0" :total="totalUserpl" :page.sync="listQueryUserpl.current" :limit.sync="listQueryUserpl.size" @pagination="fetchDataUserpl" />
          </div>
        </el-col>
        <el-col :span="6">
          <div class="app-container">
            <div class="filter-container">
              <el-button type="primary" size="mini" @click="submitRoleAndMenupl">提交</el-button>
            </div>
            <el-tag
              v-for="tag in tagspl"
              :key="tag.username"
              closable
              size="mini"
              :type="tag.type"
              @close="handleClosepl(tag)"
            >
              {{ tag.username }}
            </el-tag>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

  </div>
</template>

<script>
import { getRoleList, updateStateById, createRole, updateRole, deleteRole, deleteRoles, addRoleAndMenu, addRoleAndUser, deleteSysUserRole, addRolesUser } from '@/api/system/role'
import { getUserList, getSysRoleAndUserList, getSysRoleAndUserPageList } from '@/api/system/users'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { getSysMenuSimplifyPageList, getSysMenuByRoleId } from '@/api/system/sysMenu.js'
import { getDictDataList } from '@/utils/dictUtils'

export default {
  name: 'RoleMgn',
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
    }
  },
  data() {
    return {
      codeDisabled: false,
      tags: [],
      tagspl: [],
      gouzi: '1',
      rowrows: [],
      sizeone: 24,
      sizetwo: 0,
      activeName: 'first',
      switchs: '1',
      userRoleId: undefined,
      totalUser: 0,
      totalUserpl: 0,
      listLoadingUser: false,
      listLoadingUserpl: false,
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
      listuser: [],
      listuserpl: [],
      listQueryUser: {
        current: 1,
        username: undefined,
        nickname: undefined,
        phone: undefined,
        state: undefined
      },
      listQueryUserpl: {
        current: 1,
        username: undefined,
        nickname: undefined,
        phone: undefined,
        state: undefined
      },
      checkedkeys: [],
      rowid: '',
      panduan: '1',
      userVisible: false,
      userVisiblepl: false,
      idd: {},
      list: null,
      listLoading: true,
      listLoadingMenu: false,
      call: '',
      delVisible: false,
      addVisibleMenu: false,
      multipleSelection: [],
      props: {
        children: 'children',
        label: 'label',
        value: 'id'
      },
      deleteor: 'delete',
      datas: [],
      tubiao: ['fa fa-folder-open', 'fa fa-file', 'fa fa-folder'],
      total: 0,
      dialogStatus: 'create',
      dialogFormVisible: false,
      rowr: '',
      types: [],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      states: [],
      stateQueryParam: { id: undefined, state: undefined },
      temp: {
        name: undefined,
        code: undefined,
        type: undefined,
        updateTime: undefined,
        remark: undefined,
        state: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编号', trigger: 'blur' }],
        type: [{ required: true, message: '请输入选择角色类型', trigger: 'blur' }]
      },
      listQueryMenu: {},
      listQuery: {
        current: 1,
        keyword: '',
        order: [],
        remark: undefined,
        name: undefined,
        code: undefined,
        type: undefined
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
    this.states = getDictDataList('hw_class_type_status')
    this.types = getDictDataList('sys_role_type')
    this.fetchData()
  },
  updated() {
    if (this.gouzi === '3') {
      this.toggleSelection(this.tags)
      this.gouzi = '1'
    }
  },
  beforeUpdate() {
    console.log(this)
  },
  methods: {
    getRowKeysecond(row) {
      return row.id
    },
    deleteSysUserRoleByMap(row) {
      const map = { user_id: row.id, role_id: this.userRoleId }
      deleteSysUserRole(map).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    deleteSysUserRole(row) {
      this.deleteSysUserRoleByMap(row)
      this.myfetchDataUser()
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.switchs = '2'
        this.sizeone = 19
        this.sizetwo = 5
        this.roleAndUserList()
        this.fetchDataUser()
      } else {
        this.switchs = '1'
        this.sizeone = 19
        this.sizetwo = 5
        this.myfetchDataUser()
      }
    },
    toggleSelection(rows) {
      const ccc = this.$refs.multipleTable
      if (rows) {
        rows.forEach(row => {
          this.listuser.forEach(function(a) {
            if (row.id === a.id) {
              ccc.toggleRowSelection(a, true)
            }
          })
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    roleAndUserList() {
      getSysRoleAndUserList({ id: this.userRoleId }).then(response => {
        this.tags = response.data
      })
    },
    handleClose(tag) {
      const tagss = this.tags
      tagss.forEach(function(a, b) {
        if (a['id'] === tag.id) {
          tagss.splice(b, 1)
        }
      })
      this.deleteSysUserRoleByMap(tag)
      this.$refs.multipleTable.toggleRowSelection(tag)
    },
    handleClosepl(tag) {
      const tagss = this.tagspl
      tagss.forEach(function(a, b) {
        if (a['id'] === tag.id) {
          tagss.splice(b, 1)
        }
      })
      this.$refs.multipleTable.toggleRowSelection(tag)
    },
    fetchData() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = parseInt(response.data.total)
        this.listLoading = false
      })
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
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleFilterUser() {
      this.listQueryUser.page = 1
      if (this.activeName === 'first') {
        this.myfetchDataUser()
      } else {
        this.roleAndUserList()
        this.fetchDataUser()
      }
    },
    handleFilterUserpl() {
      this.listQueryUser.page = 1
      this.fetchDataUserpl()
    },
    stateIsSysFormat(row) {
      let vv = '-'
      const typ = this.states
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === ('' + row.state)) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    typeIsSysFormat(row) {
      let vv = '-'
      const typ = this.types
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.value === row.type) {
          vv = aa.label
        }
      })
      return vv
    },
    updateState(row) {
      let vv = 0
      let msg = '已启用'
      if (row.state === 0) {
        vv = 1
      }
      if (row.state === 1) {
        vv = 2
        msg = '已停用'
      }
      if (row.state === 2) {
        vv = 1
      }
      this.stateQueryParam.state = vv
      this.stateQueryParam.id = row.id
      updateStateById(this.stateQueryParam).then(() => {
        this.fetchData()
        // const mess = vv === 0 ? '已启用' : '已停用'
        this.$message(msg)
        this.delVisible = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    selectionChangeUserpl(val) {
      const listuserxz = this.listuserpl
      const tagsxz = this.tagspl
      const mm = {}
      const ee = []
      if (val.length < 1) {
        tagsxz.forEach(function(a, b) {
          listuserxz.forEach(function(c, d) {
            if (a['id'] === c['id']) {
              tagsxz.splice(b, 1)
            }
          })
        })
      } else {
        tagsxz.forEach(function(a, b) {
          mm[a['id']] = a
        })
        val.forEach(function(c, d) {
          mm[c['id']] = c
        })
        for (var key in mm) { // 此处遍历map
          ee.push(mm[key])
        }
        const differenceSet = this.listuserpl.filter(ea => val.every(eb => eb.id !== ea.id))
        ee.forEach(function(n, m) {
          differenceSet.forEach(function(v, p) {
            if (n.id === v.id) {
              ee.splice(n, 1)
            }
          })
        })
      }
      this.tagspl = ee
    },
    selectionChangeUser(val) {
      const listuserxz = this.listuser
      const tagsxz = this.tags
      const mm = {}
      const ee = []
      if (this.activeName === 'second') {
        if (val.length < 1) {
          tagsxz.forEach(function(a, b) {
            listuserxz.forEach(function(c, d) {
              if (a['id'] === c['id']) {
                tagsxz.splice(b, 1)
              }
            })
          })
        } else {
          tagsxz.forEach(function(a, b) {
            mm[a['id']] = a
          })
          val.forEach(function(c, d) {
            mm[c['id']] = c
          })
          for (var key in mm) { // 此处遍历map
            ee.push(mm[key])
          }
          const differenceSet = this.listuser.filter(ea => val.every(eb => eb.id !== ea.id))
          ee.forEach(function(n, m) {
            differenceSet.forEach(function(v, p) {
              if (n.id === v.id) {
                ee.splice(n, 1)
              }
            })
          })
        }
      }
      this.tags = ee
      // this.tags = val
    },
    handleDelete() {
      this.temp = Object.assign({}, this.rowr) // copy obj
      deleteRole(this.temp.id).then(() => {
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
      deleteRoles(delarr).then(() => {
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
    }, handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.codeDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.codeDisabled = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetFilter() {
      // 重置
      this.listQuery.name = undefined
      this.listQuery.state = undefined
      this.listQuery.type = undefined
      this.listQuery.code = undefined
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        code: undefined,
        type: undefined,
        updateTime: undefined,
        remark: undefined,
        state: undefined
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
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
          updateRole(tempData).then(() => {
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
    nodecollapse(data, node, s) {
      this.panduan = '1'
      this.panduan = '2'
      this.idd[data.id] = 1
    },
    nodeexpand(data, node, s) {
      this.panduan = '2'
      this.panduan = '1'
      delete this.idd[data.id]
    },
    relationMenus(row) {
      this.rowid = row.id
      this.addVisibleMenu = true
      this.SysMenuByUserId()
      getSysMenuSimplifyPageList(this.listQueryMenu).then(response => {
        this.idd = {}
        this.datas = response.data
      })
    },
    SysMenuByUserId() {
      this.checkedkeys = []
      const ma = { id: this.rowid }
      getSysMenuByRoleId(ma).then(response => {
        if (response.data.length < 1) {
          this.checkedkeys = []
        }
        var $this = this
        response.data.forEach(function(a, b) {
          $this.checkedkeys.push(a.id)
        })
      })
    },
    relationUser(row) {
      this.activeName = 'first'
      this.userRoleId = row.id
      this.userVisible = true
      this.myfetchDataUser()
    },
    relationUserpl() {
      this.userVisiblepl = true
      this.fetchDataUserpl()
    },
    getCheckedNodes() {
      const idList = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys())
      if (idList === undefined || idList.length < 1) {
        this.$message('请勾选要关联的项！')
        return
      }
      const map = { id: this.rowid, idList: idList }
      addRoleAndMenu(map).then(() => {
        this.checkedkeys = []
        this.$notify({
          title: '成功',
          message: '关联成功！',
          type: 'success',
          duration: 2000
        })
        this.addVisibleMenu = false
      })
    },
    submitRoleAndMenupl() {
      const roleids = []
      const userids = []
      this.multipleSelection.forEach(function(a) {
        roleids.push(a.id)
      })
      if (roleids.length < 1) {
        this.$message('请勾选角色')
        return
      }
      this.tagspl.forEach(function(b) {
        userids.push(b.id)
      })
      if (userids.length < 1) {
        this.$message('请勾选用户')
        return
      }
      const map = { roleids: roleids, userids: userids }
      addRolesUser(map).then(() => {
        this.$notify({
          title: '成功',
          message: '关联成功',
          type: 'success',
          duration: 2000
        })
        this.addVisibleMenu = false
      })
    },
    submitRoleAndMenu() {
      const idList = []
      this.tags.forEach(function(a, b) {
        idList.push(a.id)
      })
      if (idList === undefined || idList.length < 1) {
        this.$message('请勾选要关联的项！')
        return
      }
      const map = { id: this.userRoleId, idList: idList }
      addRoleAndUser(map).then(() => {
        this.$notify({
          title: '成功',
          message: '关联成功',
          type: 'success',
          duration: 2000
        })
        this.addVisibleMenu = false
      })
    },
    fetchDataUser() {
      this.listLoadingUser = true
      getUserList(this.listQueryUser).then(response => {
        this.listuser = response.data.records
        this.totalUser = parseInt(response.data.total)
        this.listLoadingUser = false
        this.gouzi = '3'
      })
    },
    fetchDataUserpl() {
      this.listLoadingUserpl = true
      getUserList(this.listQueryUserpl).then(response => {
        this.listuserpl = response.data.records
        this.totalUserpl = parseInt(response.data.total)
        this.listLoadingUserpl = false
      })
    },
    myfetchDataUser() {
      this.listLoadingUser = true
      this.listQueryUser.roleId = this.userRoleId
      getSysRoleAndUserPageList(this.listQueryUser).then(response => {
        this.listuser = response.data.records
        this.totalUser = parseInt(response.data.total)
        this.listLoadingUser = false
      })
    },
    restUser() {

    },
    restUserpl() {

    }
  }
}
</script>

<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    color: #2b2f3a;
  }

  .el-dialog-div{
    height: 530px;
    overflow: auto;
  }

</style>
