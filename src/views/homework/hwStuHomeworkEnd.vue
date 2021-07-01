<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.usernames" placeholder="请输入用户名，多个以“,”，隔开！" type="textarea" style="width: 350px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="rest()">
        重置查询
      </el-button>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="restStart">
        重置
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="record">
        重置记录
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
      :span-method="objectSpanMethod"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        label="勾选"
        width="55"
      />
      <el-table-column align="center" label="账户名" property="username">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="作业名称">
        <template slot-scope="scope">
          {{ scope.row.subjectName }}
        </template>
      </el-table-column>
      <el-table-column label="题型" align="center">
        <template slot-scope="scope">
          {{ scope.row.subjectTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.classNames }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subState" label="状态" align="center" :formatter="subStateFormat" />
      <el-table-column label="作业提交截止时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuEndTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="restVisible" width="500px" center>
      <div class="del-dialog-cnt">
        <p style="font-weight: bold;">
          请确认是否将选中的：
        </p>
        <p v-for="item in multipleSelection">
          {{ item.username }}-{{ item.subjectName }}
        </p>
        <p style="font-weight: bold;">
          作业重置为未提交状态？
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="restVisible = false">取 消</el-button>
        <el-button type="primary" @click="restBatch()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="recordVisible" width="1080px" @opened="recordOpen()">
      <hw-stu-homework-rest-record ref="child" />
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="fetchData" />
  </div>
</template>

<script>
import { getDictDataList } from '@/utils/dictUtils'
import { getHwHomeworkEndPageList, hwStuHomeworkReset } from '@/api/homework/hwHomework'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import DictSelect from '@/components/Dict'
import hwStuHomeworkRestRecord from '@/views/homework/hwStuHomeworkRestRecord'

// 让data数据在创建阶段透传到全局变量
let that

export default {
  name: 'UserMgn',
  components: { Pagination, DictSelect, hwStuHomeworkRestRecord },
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
    genderFilter(value) {
      const genderObj = that.genders.filter(gender => gender.value === value)
      return genderObj[0].label
    }
  },
  data() {
    return {
      shang: undefined,
      rowspanstart: 0,
      recordVisible: false,
      restVisible: false,
      list: null,
      multipleSelection: [],
      listLoading: true,
      total: 0,
      listQuery: {
        usernames: undefined
      },
      subStates: [],
      usernameDisabled: false
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.subStates = getDictDataList('hw_homework_submit_status')
    this.fetchData()
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      const span = column['property'] + '-span'
      if (row[span]) {
        return row[span]
      }
    },
    mergeTableRow(data, merge) {
      if (!merge || merge.length === 0) {
        return data
      }
      merge.forEach((m) => {
        const mList = {}
        data = data.map((v, index) => {
          const rowVal = v[m]
          if (mList[rowVal]) {
            mList[rowVal]++
            data[index - (mList[rowVal] - 1)][m + '-span'].rowspan++
            v[m + '-span'] = {
              rowspan: 0,
              colspan: 0
            }
          } else {
            mList[rowVal] = 1
            v[m + '-span'] = {
              rowspan: 1,
              colspan: 1
            }
          }
          return v
        })
      })
      return data
    },
    recordOpen() {
      this.$refs.child.fetchData()
    },
    record() {
      this.recordVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    rest() {
      this.listQuery = {
        usernames: undefined
      }
      this.fetchData()
    },
    restStart() {
      if (this.multipleSelection.length < 1) {
        this.$message('请勾选要删除的项！')
      } else {
        this.restVisible = true
      }
    },
    restBatch() {
      const can = []
      this.multipleSelection.forEach(function(a, b) {
        can.push(a.id)
      })
      if (can.length < 1) {
        this.$message.error('请选择要重置的学员作业！')
      }
      hwStuHomeworkReset(can).then(res => {
        if (res.success) {
          this.restVisible = false
          this.multipleSelection = []
          this.fetchData()
          this.$notify({
            title: '成功',
            message: '重置成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$notify({
            title: '失败',
            message: '重置失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    subStateFormat(row, type) {
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
    },
    fetchData() {
      this.listLoading = true
      getHwHomeworkEndPageList(this.listQuery).then(response => {
        console.log(response.data)
        this.list = this.mergeTableRow(response.data.records, ['username'])
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
        username: '',
        nickname: '',
        password: '',
        phone: '',
        gender: 1,
        state: '0',
        departmentId: 1, // 暂时写死
        roleId: 1 // 暂时写死
      }
    }
  }
}
</script>
