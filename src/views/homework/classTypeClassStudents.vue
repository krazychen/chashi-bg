<template>

  <div>
    <el-dialog title="选择发布班级" :visible.sync="disy" width="80%">
      <div style="height: 640px">
        <el-row>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <div class="app-container">
                <span style="font-size: 15px;">用户管理</span><span><i
                  class="el-icon-refresh"
                  style="color: #2df5b7;float: right;"
                  @click="refresh"
                /></span>
                <el-input
                  v-model="filterText"
                  style="margin-top: 10px;"
                  placeholder="输入关键字进行过滤"
                />
                <el-tree
                  ref="tree"
                  v-loading="listLoading1"
                  class="filter-tree"
                  style="width: 100%;font-size: 18px"
                  :data.sync="list1"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  @node-click="treeClick"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple-light">
              <div class="app-container">
                <div class="filter-container">
                  <el-input
                    v-model="listQuery.username"
                    placeholder="用户名"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                  />
                  <el-input
                    v-model="listQuery.studentNumber"
                    placeholder="学号"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                  />
                  <el-input
                    v-model="listQuery.phone"
                    placeholder="手机号"
                    style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"
                  />
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                    查询
                  </el-button>
                  <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest">
                    重置
                  </el-button>
                  <el-button v-waves class="filter-item" type="primary" @click="sumbmitqian">
                    确定
                  </el-button>
                </div>
                <el-table
                  ref="mytable"
                  v-loading="listLoading"
                  :data.sync="list"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;"
                  row-key="id"
                  height="350px"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column
                    type="selection"
                    label="勾选"
                    width="55px"
                    :reserve-selection="true"
                    :row-key="getRowKeysecond"
                  />
                  <el-table-column align="center" label="用户名" width="150px">
                    <template slot-scope="scope">
                      {{ scope.row.username }}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="昵称" width="150px">
                    <template slot-scope="scope">
                      {{ scope.row.nickname }}
                    </template>
                  </el-table-column>
                  <el-table-column label="手机号码" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.phone }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="微信" prop="wxOpenid" align="center" width="150px" />
                  <el-table-column label="地址" prop="address" align="center" width="200px" />
                  <el-table-column label="院校" prop="schoolName" align="center" />
                  <el-table-column label="报考专业" prop="collegeName" align="center" />
                  <el-table-column label="班级" align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="light" :content="scope.row.classNames" placement="top">
                        <span>
                          <div v-if="scope.row.classNames" class="extra">
                            {{ scope.row.classNames }}
                          </div>
                        </span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column
                    class-name="status-col"
                    label="学号"
                    align="center"
                    prop="studentNumbers"
                  />
                </el-table>
                <pagination
                  v-show="total>0"
                  :total="total"
                  :page.sync="listQuery.current"
                  :limit.sync="listQuery.size"
                  @pagination="fetchData"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="bufaVisible" width="300px" center>
      <div class="del-dialog-cnt">将对学员{{ studentNames }}进行作业补发，请确认！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bufaVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import { getHwClassTypeByHomeworkId } from '@/api/homework/hwClassType'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import permission from '@/directive/permission/index.js' // 权限判断指令

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UsersMgn',
  components: { Pagination },
  directives: { waves, permission },
  filters: {
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  props: {
    treeData: {
      type: Array,
      default: undefined
    },
    usersData: {
      type: Array,
      default: undefined
    },
    dis: {
      type: Boolean,
      default: undefined
    },
    listLoadings: {
      type: Boolean,
      default: undefined
    },
    listLoading1s: {
      type: Boolean,
      default: undefined
    },
    submits: {
      type: Function,
      default: null
    },
    total: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      bufaVisible: false,
      studentNames: '',
      disy: this.dis,
      rowr: {},
      list: [],
      rows: {},
      listLoading: this.listLoadings,
      listLoading1: this.listLoading1s,
      list1: this.treeData,
      multipleSelection: [],
      listQuery: {
        current: 1,
        size: 10,
        homeworkId: undefined,
        classId: undefined,
        classTypeId: undefined,
        phone: undefined,
        username: undefined,
        studentNumber: undefined
      },
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    disy(newValue, oldvalue) {
      this.$emit('update:dis', newValue)
    },
    dis(newValue) {
      this.disy = newValue
    },
    list1(newValue, oldvalue) {
      this.$emit('update:tree-data', newValue)
    },
    treeData(newValue) {
      this.list1 = newValue
    },
    list(newValue, oldvalue) {
      this.$emit('update:users-data', newValue)
    },
    usersData(newValue) {
      this.list = newValue
    },
    listLoading(newValue, oldvalue) {
      this.$emit('update:listLoading', newValue)
    },
    listLoadings(newValue) {
      this.listLoading = newValue
    },
    listLoading1(newValue, oldvalue) {
      this.$emit('update:listLoading1', newValue)
    },
    listLoading1s(newValue) {
      this.listLoading1 = newValue
    }
  },
  beforeCreate() {
    that = this
  },
  created() {

  },
  methods: {
    cleanss() {
      if (this.$refs.mytable) {
        this.$refs.mytable.clearSelection()
      }
    },
    sumbmitqian() {
      if (this.multipleSelection.length < 1) {
        this.$message.error('请先选择要补发的学员')
        return false
      }
      let names = ''
      this.multipleSelection.forEach(function(a, b) {
        names = names + a.username + '，'
      })
      names.substring(0, name.lastIndexOf('，'))
      this.studentNames = names
      this.bufaVisible = true
    },
    submit() {
      this.submits(this.multipleSelection)
      this.bufaVisible = false
    },
    getRowKeysecond(row) {
      return row.id
    },
    async fetchData() {
      /*      this.listLoading = true
        console.log(this.listQuery)
        getUserList(this.listQuery).then(response => {
          console.log(response.data)
          this.list = response.data.records
          this.total = parseInt(response.data.total)
          this.listLoading = false
        })*/
      this.listLoading = true
      await this.$emit('getUserList', this.listQuery)
      this.listLoading = false
    },
    getParentTree() {
      this.listLoading1 = true
      getHwClassTypeByHomeworkId('1243902155040739329').then(response => {
        this.list1 = response.data
        this.listLoading1 = false
      })
    },
    treeClick(val, node, n) {
      this.rows = val
      if (val.type === '0') {
        this.listQuery.classTypeId = val.id
        this.listQuery.classId = undefined
      }
      if (val.type === '1') {
        this.listQuery.classTypeId = node.parent.data.id
        this.listQuery.classId = val.id
      }
      this.listLoading = false
      this.$emit('getUserList', this.listQuery)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.$emit('getUserList', this.listQuery)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickname: '',
        password: '123456',
        phone: '',
        gender: '',
        state: 1, // 默认启用
        officeId: '',
        regType: '1', // 开通方式为手工
        mgrType: 0 // 暂时写死
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    refresh() { // 刷新树
      this.getParentTree()
    },
    rest() { // 重置
      this.cleanss()
      this.listQuery.username = undefined
      this.listQuery.studentNumber = undefined
      this.listQuery.phone = undefined
      this.listQuery.classId = undefined
      if (this.list1.length > 0) {
        this.listQuery.classTypeId = this.list1[0].id
        this.fetchData()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 树点击
    _nodeClickFun(data, node, vm) {
    },
    // 树过滤
    _searchFun(value) {
      // 自行判断 是走后台查询，还是前端过滤
      // this.$refs.treeSelect.$refs.tree.filter(value);
      this.$refs.treeSelect.filterFun(value)
      // 后台查询
      // this.$refs.treeSelect.treeDataUpdateFun(treeData);
    },
    userTypeFormat(row) {
      let vv = '-'
      const typ = this.typesOptions
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.userType) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    regTypeFormat(row) {
      let vv = '-'
      const typ = this.regTypeCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.regType) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    genderFormat(row) {
      let vv = '-'
      const typ = this.genderCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.gender.toString()) {
          vv = aa.dictLabel
        }
      })
      return vv
    },
    stateFormat(row) {
      let vv = '-'
      const typ = this.stateCodes
      if (typ === undefined || typ.length < 1) {
        return vv
      }
      typ.forEach(function(aa, bb) {
        if (aa.dictValue === row.state.toString()) {
          vv = aa.dictLabel
        }
      })
      return vv
    }
  }
}
</script>
